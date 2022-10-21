/* eslint-disable camelcase */
import { chunk, cloneDeep, isEqual } from 'lodash';
import { register } from 'ol/proj/proj4';
import { Coordinate } from 'ol/coordinate';
import { get } from 'ol/proj';
import proj4 from 'proj4';

import {
  WfsFeature,
  CoordinateEdited,
  WfsGeometry,
  WfsPointGeometry,
  WfsMultiLineStringGeometry,
  WfsMultiPolygonGeometry,
  GeometryType,
  WfsMultiPointGeometry,
  WfsPolygonGeometry,
  WfsLineStringGeometry
} from './wfs.models';
import { getLayerByFeatureInCurrentProject } from '../gis/layers.service';
import { isCoordinateValid, normalizeCoordinates } from './wfs.util';
import { Extent } from 'ol/extent';

export interface Projection {
  authName: string;
  authSrid: number;
  proj4Text: string;
}

export interface CrgProjection {
  id: string;
  title: string;
  hidden?: boolean;
}

type Coord = Coordinate | CoordinateEdited;

function proj4Str({ lat_0, lon_0, x_0 }: { lat_0: number; lon_0: number; x_0: number }) {
  return `+proj=tmerc +lat_0=${lat_0} +lon_0=${lon_0} +k=1 +x_0=${x_0} +y_0=0 +ellps=krass +towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 +units=m +no_defs`;
}

proj4.defs('EPSG:28406', proj4Str({ lat_0: 0, lon_0: 33, x_0: 6_500_000 }));

proj4.defs('EPSG:28407', proj4Str({ lat_0: 0, lon_0: 39, x_0: 7_500_000 }));

proj4.defs('EPSG:314315', proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 32.5, x_0: 4_300_000 }));

proj4.defs('EPSG:314314', proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 35.5, x_0: 5_300_000 }));

proj4.defs('EPSG:7828', proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 32.5, x_0: 4_300_000 }));

proj4.defs('EPSG:7829', proj4Str({ lat_0: 0.083_333_333_333_333_3, lon_0: 35.5, x_0: 5_300_000 }));

proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');

register(proj4);

export const projections: CrgProjection[] = [
  {
    id: 'EPSG:28406',
    title: 'Pulkovo 1942 / Gauss-Kruger zone 6'
  },
  {
    id: 'EPSG:28407',
    title: 'Pulkovo 1942 / Gauss-Kruger zone 7'
  },
  {
    id: 'EPSG:7829',
    title: 'Pulkovo 1942 / CS63 zone X5'
  },
  {
    id: 'EPSG:7828',
    title: 'Pulkovo 1942 / CS63 zone X4'
  },
  {
    id: 'EPSG:3857',
    title: 'WGS 84 / Pseudo-Mercator'
  },
  {
    id: 'EPSG:314314',
    title: 'Pulkovo 1942 / CS63 zone X5',
    hidden: true
  },
  {
    id: 'EPSG:314315',
    title: 'Pulkovo 1942 / CS63 zone X4',
    hidden: true
  }
];

export const viewedProjections: CrgProjection[] = projections.filter(({ hidden }) => !hidden);

export function replaceHiddenProjectionId(projectionId: string): string {
  const replaceMap: Record<string, string> = {
    'EPSG:314315': 'EPSG:7828',
    'EPSG:314314': 'EPSG:7829'
  };

  return replaceMap[projectionId] || projectionId;
}

export function getProjection(projectionStr: string): CrgProjection {
  // мы ожидаем, что запрашивается одна из зарегистрированных проекций по id
  const projection = projections.find(({ id }) => id === projectionStr);

  if (!projection) {
    try {
      // но с API может прийти PROJCS строка, proj4 строка или ещё что-нибудь неожиданное
      // если proj4 смог это понять, то и пусть, с этим можно работать дальше
      proj4(projectionStr);

      return { id: projectionStr, title: 'unknown' };
    } catch {
      throw new Error('Неподдерживаемая проекция ' + projectionStr);
    }
  }

  return projection;
}

export function getFeatureProjection(feature: WfsFeature<Coordinate | CoordinateEdited>): CrgProjection {
  const layer = getLayerByFeatureInCurrentProject(feature);

  return getProjection(layer.nativeCRS);
}

export const olProjection = projections.find(({ id }) => id === 'EPSG:3857');
export const defaultProjection = projections.find(({ id }) => id === 'EPSG:7829');

export function transform(projFrom: CrgProjection, projTo: CrgProjection, coordinate: Coordinate): Coordinate {
  if (projFrom.id === projTo.id) {
    return coordinate;
  }

  return proj4(projFrom.id, projTo.id, coordinate).map(dis => Number(dis.toFixed(4)));
}

export function transformGeometry(
  geometry: WfsGeometry,
  projFrom: CrgProjection,
  projTo: CrgProjection,
  originGeometry?: WfsGeometry,
  transformedOriginGeometry?: WfsGeometry
): WfsGeometry<Coordinate> | undefined {
  if (!geometry) {
    return;
  }

  const { type: geometryType, coordinates } = geometry;

  if (geometryType === GeometryType.POINT) {
    const newCoordinates = transformCoordinate(
      coordinates as Coordinate,
      projFrom,
      projTo,
      originGeometry && ([originGeometry.coordinates] as Coordinate[]),
      transformedOriginGeometry && ([transformedOriginGeometry.coordinates] as Coordinate[])
    );

    return {
      ...geometry,
      coordinates: newCoordinates
    } as WfsPointGeometry;
  }

  if (geometryType === GeometryType.MULTI_POINT || geometryType === GeometryType.LINE_STRING) {
    const newCoordinates = transformGroup(
      coordinates as Coordinate[],
      projFrom,
      projTo,
      originGeometry && ([originGeometry.coordinates] as Coordinate[]),
      transformedOriginGeometry && ([transformedOriginGeometry.coordinates] as Coordinate[])
    );

    return {
      ...geometry,
      coordinates: newCoordinates
    } as WfsMultiPointGeometry | WfsLineStringGeometry;
  }

  if (geometryType === GeometryType.MULTI_LINE_STRING || geometryType === GeometryType.POLYGON) {
    const newCoordinates = transformSuperGroup(
      coordinates as Coordinate[][],
      projFrom,
      projTo,
      originGeometry && (originGeometry.coordinates as Coordinate[][]),
      transformedOriginGeometry && (transformedOriginGeometry.coordinates as Coordinate[][])
    );

    return {
      ...geometry,
      coordinates: newCoordinates
    } as WfsMultiLineStringGeometry | WfsPolygonGeometry;
  }

  if (geometryType === GeometryType.MULTI_POLYGON) {
    const newCoordinates = transformMultiSuperGroup(
      coordinates as Coordinate[][][],
      projFrom,
      projTo,
      originGeometry && (originGeometry.coordinates as Coordinate[][][]),
      transformedOriginGeometry && (transformedOriginGeometry.coordinates as Coordinate[][][])
    );

    return {
      ...geometry,
      coordinates: newCoordinates
    } as WfsMultiPolygonGeometry;
  }

  return geometry as WfsGeometry<Coordinate>;
}

export function transformExtent(extent: Extent, projectionFrom: CrgProjection, projectionTo: CrgProjection): Extent {
  return chunk(extent, 2).flatMap(coord => transform(projectionFrom, projectionTo, coord)) as Extent;
}

function transformCoordinate(
  coordEdited: Coord,
  projFrom: CrgProjection,
  projTo: CrgProjection,
  originGroup?: Coord[],
  transformedOriginGroup?: Coord[]
): Coord {
  const coord = normalizeCoordinates(coordEdited) as Coordinate;
  const originIndex = originGroup ? originGroup.findIndex(originCoord => isEqual(coord, originCoord)) : -1;

  if (originIndex !== -1) {
    return cloneDeep(transformedOriginGroup[originIndex]);
  }

  return isCoordinateValid(coord) ? transform(projFrom, projTo, coord) : coordEdited;
}

function transformGroup(
  group: Coord[],
  projFrom: CrgProjection,
  projTo: CrgProjection,
  origin?: Coord[],
  transformedOrigin?: Coord[]
): Coord[] {
  return group.map(coord => transformCoordinate(coord, projFrom, projTo, origin, transformedOrigin));
}

function transformSuperGroup(
  superGroup: Coord[][],
  projFrom: CrgProjection,
  projTo: CrgProjection,
  origin?: Coord[][],
  transformedOrigin?: Coord[][]
): Coord[][] {
  return superGroup.map((group, i) =>
    transformGroup(
      group,
      projFrom,
      projTo,
      origin && origin.length >= i - 1 && origin[i],
      transformedOrigin && transformedOrigin.length >= i - 1 && transformedOrigin[i]
    )
  );
}

function transformMultiSuperGroup(
  superGroups: Coord[][][],
  projFrom: CrgProjection,
  projTo: CrgProjection,
  origin?: Coord[][][],
  transformedOrigin?: Coord[][][]
): Coord[][][] {
  return superGroups.map((superGroup, i) =>
    transformSuperGroup(
      superGroup,
      projFrom,
      projTo,
      origin && origin.length >= i - 1 && origin[i],
      transformedOrigin && transformedOrigin.length >= i - 1 && transformedOrigin[i]
    )
  );
}

// Для подложек Яндекса, основанных на проекции 3395, нужно задать extend
// https://gis.stackexchange.com/questions/187082/openlayers-3-projection-for-yandex-maps
get('EPSG:3395').setExtent([
  -20_037_508.342_789_244, -20_037_508.342_789_244, 20_037_508.342_789_244, 20_037_508.342_789_244
]);
