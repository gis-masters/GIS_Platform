import { chunk, cloneDeep, isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import proj4 from 'proj4';

import { Projection } from '../data/projections/projections.models';
import { getProjectionCode } from '../data/projections/projections.util';
import {
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
import { services } from '../services';
import { isCoordinateArrayArray, isMultiPolygonCoordinate } from './typeGuards/isCoordinate';

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

export function transformGeometry(
  geometry: WfsGeometry,
  projFrom: Projection,
  projTo: Projection,
  originGeometry?: WfsGeometry,
  transformedOriginGeometry?: WfsGeometry
): WfsGeometry | undefined {
  if (!geometry) {
    return;
  }

  const { type: geometryType, coordinates } = geometry;

  if (geometryType === GeometryType.POINT) {
    const newCoordinates = transformCoord(
      coordinates,
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
      coordinates,
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
      coordinates,
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
    let newCoordinates;

    if (isMultiPolygonCoordinate(coordinates)) {
      newCoordinates = transformMultiSuperGroup(
        coordinates,
        projFrom,
        projTo,
        originGeometry?.coordinates as Coordinate[][][],
        transformedOriginGeometry?.coordinates as Coordinate[][][]
      );
    } else if (isCoordinateArrayArray(coordinates)) {
      newCoordinates = transformMultiSuperGroup(
        [coordinates],
        projFrom,
        projTo,
        originGeometry?.coordinates as Coordinate[][][],
        transformedOriginGeometry?.coordinates as Coordinate[][][]
      );
    } else {
      services.logger.warn('Неожиданные координаты:', coordinates);

      newCoordinates = [[[]]];
    }

    return {
      ...geometry,
      coordinates: newCoordinates
    } as WfsMultiPolygonGeometry;
  }

  return geometry as WfsGeometry;
}

export function transformCoord(
  coordEdited: Coordinate,
  projFrom: Projection,
  projTo: Projection,
  originGroup?: Coordinate[],
  transformedOriginGroup: Coordinate[] = []
): Coordinate {
  const coord = normalizeCoordinates(coordEdited) as Coordinate;
  const originIndex = originGroup ? originGroup.findIndex(originCoord => isEqual(coord, originCoord)) : -1;
  if (originIndex !== -1) {
    return cloneDeep(transformedOriginGroup[originIndex]);
  }

  return isCoordinateValid(coord) ? transform(coord, projFrom, projTo) : coordEdited;
}

export function transformGroup(
  group: Coordinate[],
  projFrom: Projection,
  projTo: Projection,
  origin?: Coordinate[],
  transformedOrigin?: Coordinate[]
): Coordinate[] {
  return group.map(coord => transformCoord(coord, projFrom, projTo, origin, transformedOrigin));
}

export function transformSuperGroup(
  superGroup: Coordinate[][],
  projFrom: Projection,
  projTo: Projection,
  origin?: Coordinate[][],
  transformedOrigin?: Coordinate[][]
): Coordinate[][] {
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
  superGroups: Coordinate[][][],
  projFrom: Projection,
  projTo: Projection,
  origin?: Coordinate[][][],
  transformedOrigin?: Coordinate[][][]
): Coordinate[][][] {
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
