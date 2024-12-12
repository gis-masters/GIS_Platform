import { chunk, cloneDeep, isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import proj4 from 'proj4';

import { Projection } from '../data/projections/projections.models';
import { getProjectionCode } from '../data/projections/projections.util';
import {
  CoordinateEdited,
  GeometryType,
  WfsFeature,
  WfsGeometry,
  WfsLineStringGeometry,
  WfsMultiLineStringGeometry,
  WfsMultiPointGeometry,
  WfsMultiPolygonGeometry,
  WfsPointGeometry,
  WfsPolygonGeometry
} from '../geoserver/wfs/wfs.models';
import { isCoordinateValid, normalizeCoordinates } from '../geoserver/wfs/wfs.util';
import { mapService } from '../map/map.service';
import { isArrayOf } from './typeGuards/isArrayOf';
import { isCoordinate, isCoordinateArray, isCoordinateArrayArray } from './typeGuards/isCoordinate';
import { isNumberArray } from './typeGuards/isNumberArray';

export type Coord = Coordinate | CoordinateEdited;

export function flipPoint(coordinate: Coordinate): Coordinate {
  return [coordinate[1], coordinate[0]];
}

export function flipLine(line: Coordinate[]): Coordinate[] {
  return line.map(flipPoint);
}

export function flipPolygon(polygon: Coordinate[][]): Coordinate[][] {
  return polygon.map(flipLine);
}

export function transformExtent(extent: Extent, projFrom: Projection, projTo: Projection): Extent {
  return chunk(extent, 2).flatMap(coord => transform(coord, projFrom, projTo)) as Extent;
}

export function transform(coordinate: Coordinate, projFrom: Projection, projTo: Projection): Coordinate {
  if (projFrom.authSrid === projTo.authSrid) {
    return coordinate;
  }

  return proj4(getProjectionCode(projFrom), getProjectionCode(projTo), coordinate).map(dis =>
    Number(dis.toFixed(mapService.PRECISION))
  );
}

export function transformCoordinates(
  coordinates: Coordinate[][],
  projFrom: Projection,
  projTo: Projection
): Coordinate[] {
  return coordinates.flatMap(line => line.map(coordinate => transform(coordinate, projFrom, projTo)));
}

export function transformAnyCoordinates(
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][],
  projFrom: Projection,
  projTo: Projection
): false | Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][] {
  if (isCoordinate(coordinates)) {
    const olCoordinates = transformCoord(coordinates, projFrom, projTo);

    return isNumberArray(olCoordinates) && olCoordinates;
  }

  if (isCoordinateArray(coordinates)) {
    const olCoordinates = transformGroup(coordinates, projFrom, projTo);

    return isCoordinateArray(olCoordinates) && olCoordinates;
  }

  if (isArrayOf(coordinates, isCoordinateArray)) {
    const olCoordinates = transformSuperGroup(coordinates, projFrom, projTo);

    return isArrayOf(olCoordinates, isCoordinateArray) && olCoordinates;
  }

  const olCoordinates = transformMultiSuperGroup(coordinates, projFrom, projTo);

  return isArrayOf(olCoordinates, isCoordinateArrayArray) && olCoordinates;
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

  return isCoordinateValid(coord) ? transform(coord, projFrom, projTo) : coordEdited;
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

export function transformGeometryToLayerProjectionInWfsFeature(
  feature: WfsFeature,
  projFrom: Projection,
  projTo: Projection
): void {
  if (feature.geometry) {
    feature.geometry = transformGeometry(feature.geometry, projFrom, projTo);
  }
}
