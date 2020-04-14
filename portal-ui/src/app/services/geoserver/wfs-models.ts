import { Coordinate } from 'ol/coordinate';
import GeometryType from 'ol/geom/GeometryType';

export type CoordinateEdited = (number | string)[];

export type SupportedGeometryType = GeometryType.POINT | GeometryType.MULTI_LINE_STRING | GeometryType.MULTI_POLYGON;

export const supportedGeometryTypes: GeometryType[] & SupportedGeometryType[] = [
  GeometryType.POINT,
  GeometryType.MULTI_LINE_STRING,
  GeometryType.MULTI_POLYGON
];

interface GeoJSONObject {
  type: string;
  bbox?: number[];
}

interface Geometry extends GeoJSONObject {
  type: GeometryType;
}

export interface WfsPointGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.POINT;
  coordinates: T;
}

export interface WfsMultiLineStringGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.MULTI_LINE_STRING;
  coordinates: T[][];
}

export interface WfsMultiPolygonGeometry<T = Coordinate> extends Geometry {
  type: GeometryType.MULTI_POLYGON;
  coordinates: T[][][];
}

interface OtherGeometry<T = Coordinate> extends Geometry {
  type: Exclude<GeometryType, SupportedGeometryType>;
  coordinates: T | T[][] | T[][][];
}

export type SupportedWfsGeometry<T = Coordinate> = WfsPointGeometry<T> |
                                                   WfsMultiLineStringGeometry<T> |
                                                   WfsMultiPolygonGeometry<T>;

export type WfsGeometry<T = Coordinate> = SupportedWfsGeometry<T> | OtherGeometry<T>;

export type WfsGeometryEdited = WfsGeometry<CoordinateEdited>;

export interface WfsFeature<T = Coordinate> extends GeoJSONObject {
  type: 'Feature';
  id: string;
  geometry: WfsGeometry<T>;
  geometry_name: string;
  properties: any;
}

export interface WfsFeatureCollection extends GeoJSONObject {
  type: 'FeatureCollection';
  features: WfsFeature[];
  totalFeatures: number;
  numberMatched: number;
  numberReturned: number;
  timeStamp: string;
  bbox: number[];
}
