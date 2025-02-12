import { isEqual } from 'lodash';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import { SimpleGeometry } from 'ol/geom';

import { PageOptions, SortOrder } from '../../models';
import { wfsFeatureToFeature } from '../../util/open-layers.util';
import { GeometryType, WfsFeature, WfsGeometry, WfsPointGeometry } from './wfs.models';

export function getEmptyGeometry(type: GeometryType): WfsGeometry {
  if (type === GeometryType.POINT) {
    return {
      type,
      coordinates: [0, 0]
    } as WfsPointGeometry;
  }

  if (type === GeometryType.LINE_STRING || type === GeometryType.MULTI_POINT) {
    return {
      type,
      coordinates: [[0, 0]]
    };
  }

  if (type === GeometryType.MULTI_LINE_STRING || type === GeometryType.POLYGON) {
    return {
      type,
      coordinates: [
        [
          [0, 0],
          [0, 0]
        ]
      ]
    };
  }

  if (type === GeometryType.MULTI_POLYGON) {
    return {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
          ]
        ]
      ]
    };
  }

  throw new Error(`Неподдерживаемый тип геометрии: ${type}`);
}

export function isLinear(...geometryTypes: (GeometryType | undefined)[]): boolean {
  return geometryTypes.every(
    geometryType => geometryType === GeometryType.LINE_STRING || geometryType === GeometryType.MULTI_LINE_STRING
  );
}

export function isPolygonal(...geometryTypes: (GeometryType | undefined)[]): boolean {
  return geometryTypes.every(
    geometryType => geometryType === GeometryType.POLYGON || geometryType === GeometryType.MULTI_POLYGON
  );
}

export function isPoint(...geometryTypes: (GeometryType | undefined)[]): boolean {
  return geometryTypes.every(
    geometryType => geometryType === GeometryType.POINT || geometryType === GeometryType.MULTI_POINT
  );
}

export function selectLabelForGeometryType(
  geometryType: GeometryType | undefined,
  ifPolygonal: string,
  ifLinear: string,
  ifPointOrOther?: string,
  ifOther?: string
): string {
  if (isPolygonal(geometryType)) {
    return ifPolygonal;
  } else if (isLinear(geometryType)) {
    return ifLinear;
  } else if (isPoint(geometryType) && ifPointOrOther) {
    return ifPointOrOther;
  }

  return ifOther || ifPointOrOther || '';
}

export function generateWfsSortParam(pageOptions: PageOptions): string {
  const order = pageOptions.sortOrder === SortOrder.DESC ? '+D' : '+A';

  return (pageOptions.sort && pageOptions.sort + order) || '';
}

type Coords = Coordinate | Coordinate[][] | Coordinate[][][];

export function normalizeCoordinates(coord: Coords | string | number): Coords | number {
  return Array.isArray(coord) ? ((coord as Coords[]).map(normalizeCoordinates) as Coords) : asNumber(coord);
}

export function isGeometryValid(geometry: WfsGeometry): boolean {
  return isCoordinateValid(geometry.coordinates.flat(5) as Coordinate) && !hasUnclosedPolygons(geometry);
}

function hasUnclosedPolygons(geometry: WfsGeometry): boolean {
  return geometry.type === GeometryType.MULTI_POLYGON
    ? geometry.coordinates.some(polygon => polygon.some(loop => !isEqual(loop[0], loop.at(-1))))
    : false;
}

export function isCoordinateValid(coord: Coordinate): boolean {
  return coord?.every(isDimensionValid);
}

export function isDimensionValid(dimension: string | number): boolean {
  return !Number.isNaN(asNumber(dimension));
}

export function asNumber(dimension: number | string): number {
  return String(dimension).trim() === '' ? Number.NaN : Number(dimension);
}

export function getFeatureExtent(feature: WfsFeature): Extent | undefined {
  const olFeature: Feature<SimpleGeometry> = wfsFeatureToFeature(feature);
  const extent: Extent | undefined = olFeature?.getGeometry()?.getExtent();

  if (!olFeature) {
    throw new Error('Incorrect feature');
  }

  return extent;
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
