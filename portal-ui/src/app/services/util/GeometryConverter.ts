import {
  type Circle,
  type Geometry,
  type GeometryCollection,
  type LinearRing,
  type LineString,
  type MultiLineString,
  type MultiPoint,
  type MultiPolygon,
  type Point,
  type Polygon
} from 'ol/geom';

import { type AnyCoordinate } from '../geometry/geometry.models';
import { services } from '../services';

export function getCoordinatesFromGeometry(geometry: Geometry): AnyCoordinate | undefined {
  const type = geometry.getType();

  switch (type) {
    case 'Point': {
      return (geometry as Point).getCoordinates();
    }
    case 'LineString': {
      return (geometry as LineString).getCoordinates();
    }
    case 'LinearRing': {
      return (geometry as LinearRing).getCoordinates();
    }
    case 'Polygon': {
      return (geometry as Polygon).getCoordinates();
    }
    case 'MultiPoint': {
      return (geometry as MultiPoint).getCoordinates();
    }
    case 'MultiLineString': {
      return (geometry as MultiLineString).getCoordinates();
    }
    case 'MultiPolygon': {
      return (geometry as MultiPolygon).getCoordinates();
    }
    case 'GeometryCollection': {
      return (geometry as GeometryCollection)
        .getGeometries()
        .map(geom => getCoordinatesFromGeometry(geom)) as AnyCoordinate;
    }
    case 'Circle': {
      return (geometry as Circle).getCenter();
    }
    default: {
      services.logger.warn('Unsupported geometry type:', type);

      return undefined;
    }
  }
}
