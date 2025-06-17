import { Coordinate } from 'ol/coordinate';

export enum GeometryType {
  POINT = 'Point',
  LINE_STRING = 'LineString',
  LINEAR_RING = 'LinearRing',
  POLYGON = 'Polygon',
  MULTI_POINT = 'MultiPoint',
  MULTI_LINE_STRING = 'MultiLineString',
  MULTI_POLYGON = 'MultiPolygon',
  GEOMETRY_COLLECTION = 'GeometryCollection',
  CIRCLE = 'Circle'
}

export type SupportedGeometryType =
  | GeometryType.POINT
  | GeometryType.MULTI_POINT
  | GeometryType.LINE_STRING
  | GeometryType.MULTI_LINE_STRING
  | GeometryType.POLYGON
  | GeometryType.MULTI_POLYGON;

export const supportedGeometryTypes: GeometryType[] & SupportedGeometryType[] = [
  GeometryType.POINT,
  GeometryType.MULTI_POINT,
  GeometryType.LINE_STRING,
  GeometryType.MULTI_LINE_STRING,
  GeometryType.POLYGON,
  GeometryType.MULTI_POLYGON
];

interface GeoJSONObject {
  type: string;
  bbox?: [number, number, number, number];
}

interface Geometry extends GeoJSONObject {
  type: GeometryType;
}

export interface WfsLinearRingGeometry extends Geometry {
  type: GeometryType.LINEAR_RING;
  coordinates: Coordinate;
}

export interface WfsCircleGeometry extends Geometry {
  type: GeometryType.CIRCLE;
  coordinates: Coordinate;
}

export interface WfsCollectionGeometry extends Geometry {
  type: GeometryType.GEOMETRY_COLLECTION;
  coordinates: Coordinate;
}

export interface WfsPointGeometry extends Geometry {
  type: GeometryType.POINT;
  coordinates: Coordinate;
}

export interface WfsMultiPointGeometry extends Geometry {
  type: GeometryType.MULTI_POINT;
  coordinates: Coordinate[];
}

export interface WfsLineStringGeometry extends Geometry {
  type: GeometryType.LINE_STRING;
  coordinates: Coordinate[];
}

export interface WfsMultiLineStringGeometry extends Geometry {
  type: GeometryType.MULTI_LINE_STRING;
  coordinates: Coordinate[][];
}

export interface WfsPolygonGeometry extends Geometry {
  type: GeometryType.POLYGON;
  coordinates: Coordinate[][];
}

export interface WfsMultiPolygonGeometry extends Geometry {
  type: GeometryType.MULTI_POLYGON;
  coordinates: Coordinate[][][];
}

export type WfsGeometry =
  | WfsPointGeometry
  | WfsMultiPointGeometry
  | WfsLineStringGeometry
  | WfsMultiLineStringGeometry
  | WfsPolygonGeometry
  | WfsMultiPolygonGeometry
  | WfsCollectionGeometry
  | WfsLinearRingGeometry
  | WfsCircleGeometry;

export type CrgFeature = Pick<WfsFeature, 'id' | 'type' | 'geometry' | 'properties'>;
export type NewWfsFeature = Omit<CrgFeature, 'id'>;
export interface WfsFeature extends GeoJSONObject {
  type: 'Feature';
  id: string;
  geometry?: WfsGeometry;
  geometry_name: string;
  properties: Record<string, unknown>;
}

export interface WfsFeatureCollection extends GeoJSONObject {
  type: 'FeatureCollection';
  features?: WfsFeature[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  bbox: [number, number, number, number];
}
