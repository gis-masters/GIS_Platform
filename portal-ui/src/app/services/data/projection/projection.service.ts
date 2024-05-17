import { Coordinate } from 'ol/coordinate';
import { get } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

import { CoordinateEdited, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import { PageOptions } from '../../models';
import { projectionClient } from './projection.client';
import { DEFAULT_OL_PROJECTION, defaultOlCrs, Projection } from './projection.models';
import { getProjectionTitle, projectionUnit } from './projection.util';

const projectionCache: Record<string, Promise<Projection | undefined>> = {};

export async function getProjection(pageOptions: PageOptions): Promise<[Projection[], number]> {
  const response = await projectionClient.getKnownProjection(pageOptions);

  const modifiedProjections: Projection[] = response.content.map(proj => ({
    ...proj,
    title: `${getProjectionTitle(proj.srtext)}, ${proj.authName}:${proj.authSrid}, ${projectionUnit(proj.srtext)}`,
    auth_srid: proj.authSrid,
    auth_name: proj.authName,
    srtext: proj.srtext,
    proj4Text: proj.proj4Text
  }));

  return [modifiedProjections || [], response.page.totalPages];
}

export async function getProjectionByCrs(crs: string): Promise<Projection | undefined> {
  const cache = await projectionCache[crs];

  if (cache) {
    return projectionCache[crs];
  }

  projectionCache[crs] = fetchProjection(crs);

  const projection = await projectionCache[crs];

  if (!projection) {
    // не кешируем ошибки
    delete projectionCache[crs];

    return;
  }

  return projection;
}

async function fetchProjection(crs: string): Promise<Projection | undefined> {
  const crsSrid = crs.split(':')[1];

  if (crsSrid) {
    const pageOptions: PageOptions = {
      page: 0,
      pageSize: 1,
      filter: { auth_srid: Number(crsSrid) }
    };

    const [result] = await getProjection(pageOptions);

    if (!result.length) {
      return;
    }

    registerProjectionArrayInProj4([result[0]]);

    return result[0];
  }
}

// 3857 - проекция для корректной работы ol, не удалять, не менять
export async function getOlProjection(): Promise<Projection> {
  const projection = await getProjectionByCrs(`${DEFAULT_OL_PROJECTION.authName}:${DEFAULT_OL_PROJECTION.code}`);

  if (!projection) {
    throw new Error('Ошибка получения проекции ' + defaultOlCrs);
  }

  return projection;
}

export async function getFeatureProjection(
  feature: WfsFeature<Coordinate | CoordinateEdited>
): Promise<Projection | undefined> {
  const layer = getLayerByFeatureInCurrentProject(feature);
  if (!layer) {
    throw new Error('Не удалось определить проекцию слоя. Не найден слой для объекта: ' + feature.id);
  }

  return await getProjectionByCrs(layer.nativeCRS);
}

export function registerProjectionArrayInProj4(projections: Projection[]): void {
  // TODO: пофиксить костыльный хардкод после выполнения №1852
  for (const proj of projections) {
    if (
      proj.authSrid !== 3857 &&
      proj.authSrid !== 28_406 &&
      proj.authSrid !== 28_407 &&
      proj.authSrid !== 314_315 &&
      proj.authSrid !== 314_314 &&
      proj.authSrid !== 7828 &&
      proj.authSrid !== 7829 &&
      proj.authSrid !== 3395
    ) {
      proj4.defs(`${proj.authName}:${proj.authSrid}`, proj.proj4Text);
    }

    if (proj.authSrid === 28_406) {
      proj4.defs(`${proj.authName}:${proj.authSrid}`, proj4Str({ lat_0: 0, lon_0: 33, x_0: 6_500_000 }));
    }

    if (proj.authSrid === 28_407) {
      proj4.defs(`${proj.authName}:${proj.authSrid}`, proj4Str({ lat_0: 0, lon_0: 39, x_0: 7_500_000 }));
    }

    if (proj.authSrid === 314_315) {
      proj4.defs(
        `${proj.authName}:${proj.authSrid}`,
        proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 32.5, x_0: 4_300_000 })
      );
    }

    if (proj.authSrid === 314_314) {
      proj4.defs(
        `${proj.authName}:${proj.authSrid}`,
        proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 35.5, x_0: 5_300_000 })
      );
    }

    if (proj.authSrid === 7828) {
      proj4.defs(
        `${proj.authName}:${proj.authSrid}`,
        proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 32.5, x_0: 4_300_000 })
      );
    }

    if (proj.authSrid === 7829) {
      proj4.defs(
        `${proj.authName}:${proj.authSrid}`,
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
