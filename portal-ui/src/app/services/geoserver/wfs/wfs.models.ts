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

export type CoordinateEdited = (number | string)[];

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

export interface WfsPointGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.POINT;
  coordinates: T;
}

export interface WfsMultiPointGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.MULTI_POINT;
  coordinates: T[];
}

export interface WfsLineStringGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.LINE_STRING;
  coordinates: T[];
}

export interface WfsMultiLineStringGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.MULTI_LINE_STRING;
  coordinates: T[][];
}

export interface WfsPolygonGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.POLYGON;
  coordinates: T[][];
}

export interface WfsMultiPolygonGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.MULTI_POLYGON;
  coordinates: T[][][];
}

interface OtherGeometry<T = Coordinate> extends Geometry {
  type: Exclude<GeometryType, SupportedGeometryType>;
  coordinates: T | T[] | T[][] | T[][][];
}

export type SupportedWfsGeometry<T = Coordinate> =
  | WfsPointGeometry<T>
  | WfsMultiPointGeometry<T>
  | WfsLineStringGeometry<T>
  | WfsMultiLineStringGeometry<T>
  | WfsPolygonGeometry<T>
  | WfsMultiPolygonGeometry<T>;

export type WfsGeometry<T = Coordinate | CoordinateEdited> = SupportedWfsGeometry<T> | OtherGeometry<T>;

export type NewWfsFeature = Pick<WfsFeature, 'type' | 'geometry' | 'properties'>;
export interface WfsFeature<T extends Coordinate | CoordinateEdited = Coordinate> extends GeoJSONObject {
  type: 'Feature';
  id: string;
  geometry?: WfsGeometry<T>;
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
