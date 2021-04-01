import { cloneDeep, isEqual } from 'lodash';
import { register } from 'ol/proj/proj4';
import { Coordinate } from 'ol/coordinate';
import GeometryType from 'ol/geom/GeometryType';
import proj4 from 'proj4';

import {
  WfsFeature,
  CoordinateEdited,
  WfsGeometry,
  WfsPointGeometry,
  WfsMultiLineStringGeometry,
  WfsMultiPolygonGeometry
} from './wfs.models';
import { getFeatureLayer } from './layers.service';
import { normalizeCoordinates, isCoordinateValid } from './wfs.service';

export interface CrgProjection {
  id: string;
  title: string;
}

type Coord = Coordinate | CoordinateEdited;

proj4.defs(
  'EPSG:28406',
  '+proj=tmerc ' +
    '+lat_0=0 ' +
    '+lon_0=33 ' +
    '+k=1 ' +
    '+x_0=6500000 ' +
    '+y_0=0 ' +
    '+ellps=krass ' +
    '+towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 ' +
    '+units=m ' +
    '+no_defs'
);

proj4.defs(
  'EPSG:28407',
  '+proj=tmerc ' +
    '+lat_0=0 ' +
    '+lon_0=39 ' +
    '+k=1 ' +
    '+x_0=7500000 ' +
    '+y_0=0 ' +
    '+ellps=krass ' +
    '+towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 ' +
    '+units=m ' +
    '+no_defs'
);

proj4.defs(
  'EPSG:314315',
  '+proj=tmerc ' +
    '+lat_0=0.0833333333333333 ' +
    '+lon_0=32.5 ' +
    '+k=1 ' +
    '+x_0=4300000 ' +
    '+y_0=0 ' +
    '+ellps=krass ' +
    '+towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 ' +
    '+units=m ' +
    '+no_defs'
);

proj4.defs(
  'EPSG:314314',
  '+proj=tmerc ' +
    '+lat_0=0.0833333333333333 ' +
    '+lon_0=35.5 ' +
    '+k=1 ' +
    '+x_0=5300000 ' +
    '+y_0=0 ' +
    '+ellps=krass ' +
    '+towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 ' +
    '+units=m ' +
    '+no_defs'
);

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
    id: 'EPSG:314314',
    title: 'Pulkovo 1942 / CS63 zone X5'
  },
  {
    id: 'EPSG:314315',
    title: 'Pulkovo 1942 / CS63 zone X4'
  },
  {
    id: 'EPSG:3857',
    title: 'WGS 84 / Pseudo-Mercator'
  }
];

export function getProjection(projectionStr: string): CrgProjection {
  // мы ожидаем, что запрашивается одна из зарегистрированных проекций по id
  const projection = projections.find(({ id }) => id === projectionStr);

  if (!projection) {
    try {
      // но с API может прийти PROJCS строка, proj4 строка или ещё что-нибудь неожиданное
      // если proj4 смог это понять, то и пусть, с этим можно работать дальше
      proj4(projectionStr);

      return { id: projectionStr, title: 'unknown' };
    } catch (e) {
      throw new Error('Неподдерживаемая проекция ' + projectionStr);
    }
  }

  return projection;
}

export function getFeatureProjection(feature: WfsFeature): CrgProjection {
  const layer = getFeatureLayer(feature);

  return getProjection(layer.nativeCRS);
}

export const olProjection = projections.find(({ id }) => id === 'EPSG:3857');

export function transform(projFrom: CrgProjection, projTo: CrgProjection, coordinate: Coordinate) {
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

  if (geometryType === GeometryType.MULTI_LINE_STRING) {
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
    } as WfsMultiLineStringGeometry;
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
