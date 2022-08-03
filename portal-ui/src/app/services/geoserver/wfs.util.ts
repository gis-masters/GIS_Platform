import { isEqual } from 'lodash';
import { Feature } from 'ol';
import { Extent } from 'ol/extent';
import { SimpleGeometry } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';

import { CoordinateEdited, GeometryType, WfsFeature, WfsGeometry, WfsMultiPolygonGeometry } from './wfs.models';
import { PageOptions, SortOrder } from '../models';
import { wfsFeatureToFeature } from '../util/open-layers.util';
import { services } from '../services';

export function getEmptyGeometry(geometryType: GeometryType): WfsGeometry<CoordinateEdited> {
  if (geometryType === GeometryType.POINT) {
    return {
      type: GeometryType.POINT,
      coordinates: ['', '']
    };
  }

  if (geometryType === GeometryType.MULTI_LINE_STRING) {
    return {
      type: GeometryType.MULTI_LINE_STRING,
      coordinates: [
        [
          ['', ''],
          ['', '']
        ]
      ]
    };
  }

  if (geometryType === GeometryType.MULTI_POLYGON) {
    return {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', '']
          ]
        ]
      ]
    };
  }
}

function isLinear(geometryType: GeometryType) {
  return [
    GeometryType.CIRCLE,
    GeometryType.LINEAR_RING,
    GeometryType.LINE_STRING,
    GeometryType.MULTI_LINE_STRING
  ].includes(geometryType);
}

function isPolygonal(geometryType: GeometryType) {
  return [GeometryType.MULTI_POLYGON, GeometryType.POLYGON].includes(geometryType);
}

function isPoint(geometryType: GeometryType) {
  return geometryType === GeometryType.POINT;
}

export function selectLabelForGeometryType(
  geometryType: GeometryType,
  ifPolygonal: string,
  ifLinear: string,
  ifPointOrOther?: string,
  ifOther?: string
): string {
  if (isPolygonal(geometryType)) {
    return ifPolygonal;
  } else if (isLinear(geometryType)) {
    return ifLinear;
  } else if (isPoint(geometryType)) {
    return ifPointOrOther;
  }

  return ifOther || ifPointOrOther;
}

export function generateWfsSortParam(pageOptions: PageOptions): string {
  const order = pageOptions.sortOrder === SortOrder.DESC ? '+D' : '+A';

  return (pageOptions.sort && pageOptions.sort + order) || '';
}

type Coords = Coordinate | Coordinate[][] | Coordinate[][][];
type CoordsEdited = CoordinateEdited | CoordinateEdited[][] | CoordinateEdited[][][];

export function normalizeCoordinates(coord: CoordsEdited | string | number): Coords | number {
  return Array.isArray(coord)
    ? ((coord as CoordsEdited[]).map(normalizeCoordinates) as Coords)
    : transformDimension(coord);
}

export function isGeometryValid(geometry: WfsGeometry): boolean {
  return isCoordinateValid(geometry.coordinates.flat(5) as Coordinate) && !hasUnclosedPolygons(geometry);
}

function hasUnclosedPolygons(geometry: WfsGeometry): boolean {
  return geometry.type === GeometryType.MULTI_POLYGON
    ? (geometry as WfsMultiPolygonGeometry).coordinates.some(polygon =>
        polygon.some(loop => !isEqual(loop[0], loop[loop.length - 1]))
      )
    : false;
}

export function isCoordinateValid(coord: Coordinate): boolean {
  return coord?.every(isDimensionValid);
}

export function isDimensionValid(dimension: string | number): boolean {
  return !Number.isNaN(transformDimension(dimension));
}

export function transformDimension(dimension: number | string): number {
  return String(dimension).trim() === '' ? Number.NaN : Number(dimension);
}

export function getFeatureExtent(feature: WfsFeature): Extent {
  const olFeature: Feature<SimpleGeometry> = wfsFeatureToFeature(feature, true);

  if (!olFeature) {
    services.logger.warn('Incorrect feature: ', feature);

    return;
  }

  return olFeature.getGeometry().getExtent();
}

export function mergeExtents(extents: Extent[]): Extent {
  const resultExtent: Extent = extents[0];

  for (const extent of extents) {
    resultExtent[0] = Math.min(resultExtent[0], extent[0]);
    resultExtent[1] = Math.min(resultExtent[1], extent[1]);
    resultExtent[2] = Math.max(resultExtent[2], extent[2]);
    resultExtent[3] = Math.max(resultExtent[3], extent[3]);
  }

  return resultExtent;
}
