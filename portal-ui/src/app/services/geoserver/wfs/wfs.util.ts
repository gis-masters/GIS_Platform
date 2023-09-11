import { isEqual } from 'lodash';
import { Feature } from 'ol';
import { Extent } from 'ol/extent';
import { SimpleGeometry } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';

import {
  CoordinateEdited,
  GeometryType,
  WfsFeature,
  WfsGeometry,
  WfsMultiPolygonGeometry,
  WfsPointGeometry
} from './wfs.models';
import { wfsFeatureToFeature } from '../../util/open-layers.util';
import { getGeometryFieldName } from '../../data/schema/schema.utils';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { schemaService } from '../../data/schema/schema.service';
import { PageOptions, SortOrder } from '../../models';
import { services } from '../../services';

export async function getEmptyFeature(layer: CrgVectorLayer): Promise<WfsFeature<CoordinateEdited>> {
  const { tableName, schemaId } = layer;
  const schema = await schemaService.getSchema(schemaId);

  const properties = Object.fromEntries(schema.properties.map(({ name }) => [name.toLowerCase(), null]));

  return {
    type: 'Feature',
    id: `${tableName}.0`, // костыль для EditFeatureComponent, который берёт тип фичи из id (AAAAAAA!!!)
    geometry: getEmptyGeometry(schema.geometryType),
    geometry_name: getGeometryFieldName(schema),
    properties
  };
}

export function getEmptyGeometry(type: GeometryType): WfsGeometry<CoordinateEdited> {
  if (type === GeometryType.POINT) {
    return {
      type,
      coordinates: ['', '']
    } as WfsPointGeometry<CoordinateEdited>;
  }

  if (type === GeometryType.LINE_STRING || type === GeometryType.MULTI_POINT) {
    return {
      type,
      coordinates: [['', '']]
    };
  }

  if (type === GeometryType.MULTI_LINE_STRING || type === GeometryType.POLYGON) {
    return {
      type,
      coordinates: [
        [
          ['', ''],
          ['', '']
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

export function isLinear(...geometryTypes: GeometryType[]): boolean {
  return geometryTypes.every(
    geometryType => geometryType === GeometryType.LINE_STRING || geometryType === GeometryType.MULTI_LINE_STRING
  );
}

export function isPolygonal(...geometryTypes: GeometryType[]): boolean {
  return geometryTypes.every(
    geometryType => geometryType === GeometryType.POLYGON || geometryType === GeometryType.MULTI_POLYGON
  );
}

export function isPoint(...geometryTypes: GeometryType[]): boolean {
  return geometryTypes.every(
    geometryType => geometryType === GeometryType.POINT || geometryType === GeometryType.MULTI_POINT
  );
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
        polygon.some(loop => !isEqual(loop[0], loop.at(-1)))
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
