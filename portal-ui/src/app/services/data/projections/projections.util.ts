import { chunk, cloneDeep, isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import proj4 from 'proj4';

import {
  CoordinateEdited,
  GeometryType,
  WfsGeometry,
  WfsLineStringGeometry,
  WfsMultiLineStringGeometry,
  WfsMultiPointGeometry,
  WfsMultiPolygonGeometry,
  WfsPointGeometry,
  WfsPolygonGeometry
} from '../../geoserver/wfs/wfs.models';
import { isCoordinateValid, normalizeCoordinates } from '../../geoserver/wfs/wfs.util';
import { isStringArray } from '../../util/typeGuards/isStringArray';
import { Projection } from './projections.models';

export type Coord = Coordinate | CoordinateEdited;

export function getSrid(projectionCode: string): number {
  const srid = projectionCode.split(':')[1];

  if (!srid) {
    throw new Error('Некорректный код проекции');
  }

  return Number(srid);
}

export function getProjectionCode(projection: Projection): string {
  return `${projection.authName}:${projection.authSrid}`;
}

export function transform(projFrom: Projection, projTo: Projection, coordinate: Coordinate): Coordinate {
  if (projFrom.authSrid === projTo.authSrid) {
    return coordinate;
  }

  return proj4(getProjectionCode(projFrom), getProjectionCode(projTo), coordinate).map(dis => Number(dis.toFixed(4)));
}

export function transformGeometry(
  geometry: WfsGeometry,
  projFrom: Projection,
  projTo: Projection,
  originGeometry?: WfsGeometry,
  transformedOriginGeometry?: WfsGeometry
): WfsGeometry<Coordinate> | undefined {
  if (!geometry) {
    return;
  }

  const { type: geometryType, coordinates } = geometry;

  if (geometryType === GeometryType.POINT) {
    const newCoordinates = transformCoord(
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

export function transformExtent(extent: Extent, projectionFrom: Projection, projectionTo: Projection): Extent {
  return chunk(extent, 2).flatMap(coord => transform(projectionFrom, projectionTo, coord)) as Extent;
}

export function transformCoord(
  coordEdited: Coord,
  projFrom: Projection,
  projTo: Projection,
  originGroup?: Coord[],
  transformedOriginGroup: Coord[] = []
): Coord {
  const coord = normalizeCoordinates(coordEdited) as Coordinate;
  const originIndex = originGroup ? originGroup.findIndex(originCoord => isEqual(coord, originCoord)) : -1;

  if (originIndex !== -1) {
    return cloneDeep(transformedOriginGroup[originIndex]);
  }

  return isCoordinateValid(coord) ? transform(projFrom, projTo, coord) : coordEdited;
}

export function transformGroup(
  group: Coord[],
  projFrom: Projection,
  projTo: Projection,
  origin?: Coord[],
  transformedOrigin?: Coord[]
): Coord[] {
  return group.map(coord => transformCoord(coord, projFrom, projTo, origin, transformedOrigin));
}

export function transformSuperGroup(
  superGroup: Coord[][],
  projFrom: Projection,
  projTo: Projection,
  origin?: Coord[][],
  transformedOrigin?: Coord[][]
): Coord[][] {
  return superGroup.map((group, i) =>
    transformGroup(
      group,
      projFrom,
      projTo,
      (origin && origin.length >= i - 1 && origin[i]) || undefined,
      (transformedOrigin && transformedOrigin.length >= i - 1 && transformedOrigin[i]) || undefined
    )
  );
}

export function transformMultiSuperGroup(
  superGroups: Coord[][][],
  projFrom: Projection,
  projTo: Projection,
  origin?: Coord[][][],
  transformedOrigin?: Coord[][][]
): Coord[][][] {
  return superGroups.map((superGroup, i) =>
    transformSuperGroup(
      superGroup,
      projFrom,
      projTo,
      (origin && origin.length >= i - 1 && origin[i]) || undefined,
      (transformedOrigin && transformedOrigin.length >= i - 1 && transformedOrigin[i]) || undefined
    )
  );
}

export function projectionUnit(proj: string): string {
  const unit = proj.split('UNIT');

  if (isStringArray(unit)) {
    const unitName = unit.at(-1)?.split('",')[0].split('["')[1];
    if (unitName === 'degree') {
      return 'градусы';
    }

    if (unitName === 'metre') {
      return 'метры';
    }

    if (unitName === 'US survey foot ') {
      return 'геодезический фут США';
    }
  }

  return '';
}

export function getProjectionTitle(proj: string): string {
  const projcsRegex = /PROJCS\["([^"]+)",/;
  const geogcsRegex = /GEOGCS\["([^"]+)",/;
  const unknownRegex = /\["([^"]+)",/;

  const extractTitle = (regex: RegExp): string | null => {
    const match = proj.match(regex);

    return match ? match[1].replaceAll('_', ' ') : null;
  };

  const projcsTitle = extractTitle(projcsRegex);
  if (projcsTitle) {
    return projcsTitle;
  }

  const geogcsTitle = extractTitle(geogcsRegex);
  if (geogcsTitle) {
    return geogcsTitle;
  }

  const unknownTitle = extractTitle(unknownRegex);
  if (unknownTitle) {
    return unknownTitle;
  }

  console.warn('Тип SRID не определен');

  return 'Тип SRID не определен';
}
