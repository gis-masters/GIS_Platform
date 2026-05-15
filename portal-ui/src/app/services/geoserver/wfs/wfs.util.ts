import type { MultiPolygon as GeoMultiPolygon, Polygon as GeoPolygon } from 'geojson';
import { isEqual } from 'lodash';
import { type Feature } from 'ol';
import { type Coordinate } from 'ol/coordinate';
import { type Extent } from 'ol/extent';
import { type SimpleGeometry } from 'ol/geom';

import { type PageOptions, SortOrder } from '../../models';
import { wfsFeatureToFeature } from '../../util/open-layers.util';
import { isArray } from '../../util/typeGuards/isArray';
import {
  GeometryType,
  type WfsFeature,
  type WfsGeometry,
  type WfsMultiPolygonGeometry,
  type WfsPointGeometry,
  type WfsPolygonGeometry
} from './wfs.models';

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

export function isArealWfsGeometry(
  geom: WfsGeometry | undefined
): geom is WfsPolygonGeometry | WfsMultiPolygonGeometry {
  return geom != null && isPolygonal(geom.type);
}

export function explodePolygons(g: GeoPolygon | GeoMultiPolygon): GeoPolygon[] {
  if (g.type === 'Polygon') {
    return [g];
  }

  return g.coordinates.map(coords => ({ type: 'Polygon', coordinates: coords }));
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

export const GEOMETRY_COORDINATES_FLAT_DEPTH = 5;

export function normalizeCoordinates(coord: Coords | string | number): Coords | number {
  return isArray(coord) ? ((coord as Coords[]).map(normalizeCoordinates) as Coords) : asNumber(coord);
}

export function isGeometryValid(geometry: WfsGeometry): boolean {
  return (
    isCoordinateValid(geometry.coordinates.flat(GEOMETRY_COORDINATES_FLAT_DEPTH) as Coordinate) &&
    !hasUnclosedPolygons(geometry)
  );
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
