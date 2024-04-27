import { Coordinate } from 'ol/coordinate';
import { get } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

import { CoordinateEdited, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import { PageOptions } from '../../models';
import { epsgClient } from './epsg.client';
import { DEFAULT_OL_PROJECTION, defaultOlCrs, Epsg } from './epsg.models';
import { epsgTitle, epsgUnit } from './epsg.util';

const epsgCache: Record<string, Promise<Epsg | undefined>> = {};

export async function getEpsg(pageOptions: PageOptions): Promise<[Epsg[], number]> {
  const response = await epsgClient.getKnownEpsg(pageOptions);

  const modifiedProjections: Epsg[] = response.content.map(proj => ({
    ...proj,
    title: `${epsgTitle(proj.srtext)}, ${proj.authName}:${proj.authSrid}, ${epsgUnit(proj.srtext)}`,
    auth_srid: proj.authSrid,
    srtext: proj.srtext,
    proj4Text: proj.proj4Text
  }));

  return [modifiedProjections || [], response.page.totalPages];
}

export async function getEpsgByCrs(crs: string): Promise<Epsg | undefined> {
  const cache = await epsgCache[crs];

  if (cache) {
    return epsgCache[crs];
  }

  epsgCache[crs] = fetchEpsg(crs);

  const epsg = await epsgCache[crs];

  if (!epsg) {
    // не кешируем ошибки
    delete epsgCache[crs];

    return;
  }

  return epsg;
}

async function fetchEpsg(crs: string): Promise<Epsg | undefined> {
  const crsSrid = crs.split(':')[1];

  if (crsSrid) {
    const pageOptions: PageOptions = {
      page: 0,
      pageSize: 1,
      filter: { auth_srid: Number(crsSrid) }
    };

    const [result] = await getEpsg(pageOptions);

    if (!result.length) {
      return;
    }

    registerEpsgArrayInProj4([result[0]]);

    return result[0];
  }
}

// 3857 - проекция для корректной работы ol, не удалять, не менять
export async function getOlEpsg(): Promise<Epsg> {
  const epsg = await getEpsgByCrs(`${DEFAULT_OL_PROJECTION.authName}:${DEFAULT_OL_PROJECTION.code}`);

  if (!epsg) {
    throw new Error('Ошибка получения проекции ' + defaultOlCrs);
  }

  return epsg;
}

export async function getFeatureEpsg(feature: WfsFeature<Coordinate | CoordinateEdited>): Promise<Epsg | undefined> {
  const layer = getLayerByFeatureInCurrentProject(feature);
  if (!layer) {
    throw new Error('Не удалось определить проекцию слоя. Не найден слой для объекта: ' + feature.id);
  }

  return await getEpsgByCrs(layer.nativeCRS);
}

export function registerEpsgArrayInProj4(epsgArray: Epsg[]): void {
  // TODO: пофиксить костыльный хардкод после выполнения №1852
  for (const epsg of epsgArray) {
    if (
      epsg.authSrid !== 3857 &&
      epsg.authSrid !== 28_406 &&
      epsg.authSrid !== 28_407 &&
      epsg.authSrid !== 314_315 &&
      epsg.authSrid !== 314_314 &&
      epsg.authSrid !== 7828 &&
      epsg.authSrid !== 7829 &&
      epsg.authSrid !== 3395
    ) {
      proj4.defs(`${epsg.authName}:${epsg.authSrid}`, epsg.proj4Text);
    }

    if (epsg.authSrid === 28_406) {
      proj4.defs(`${epsg.authName}:${epsg.authSrid}`, proj4Str({ lat_0: 0, lon_0: 33, x_0: 6_500_000 }));
    }

    if (epsg.authSrid === 28_407) {
      proj4.defs(`${epsg.authName}:${epsg.authSrid}`, proj4Str({ lat_0: 0, lon_0: 39, x_0: 7_500_000 }));
    }

    if (epsg.authSrid === 314_315) {
      proj4.defs(
        `${epsg.authName}:${epsg.authSrid}`,
        proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 32.5, x_0: 4_300_000 })
      );
    }

    if (epsg.authSrid === 314_314) {
      proj4.defs(
        `${epsg.authName}:${epsg.authSrid}`,
        proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 35.5, x_0: 5_300_000 })
      );
    }

    if (epsg.authSrid === 7828) {
      proj4.defs(
        `${epsg.authName}:${epsg.authSrid}`,
        proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 32.5, x_0: 4_300_000 })
      );
    }

    if (epsg.authSrid === 7829) {
      proj4.defs(
        `${epsg.authName}:${epsg.authSrid}`,
        proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 35.5, x_0: 5_300_000 })
      );
    }
  }

  register(proj4);
}

function proj4Str({ lat_0, lon_0, x_0 }: { lat_0: number; lon_0: number; x_0: number }) {
  return `+proj=tmerc +lat_0=${lat_0} +lon_0=${lon_0} +k=1 +x_0=${x_0} +y_0=0 +ellps=krass +towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 +units=m +no_defs`;
}

// СК для яндекс подложек
proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
register(proj4);

// Для подложек Яндекса, основанных на проекции 3395, нужно задать extend
// https://gis.stackexchange.com/questions/187082/openlayers-3-projection-for-yandex-maps
get('EPSG:3395')?.setExtent([
  -20_037_508.342_789_244, -20_037_508.342_789_244, 20_037_508.342_789_244, 20_037_508.342_789_244
]);
