import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import {
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  SimpleGeometry
} from 'ol/geom';

import { GeometryType, WfsFeature, WfsFeatureCollection, WfsGeometry } from '../geoserver/wfs/wfs.models';

export enum UnitsOfAreaMeasurement {
  HECTARE = 'га',
  SQUARE_KILOMETER = 'км²',
  SQUARE_METER = 'м²'
}

export enum UnitsOfLengthMeasurement {
  KILOMETER = 'км',
  METER = 'м'
}

/**
 * Из OpenLayer фичи {@link Feature} формируем {@link WfsFeature}
 */
export function featureToWfsFeature(olFeature: Feature): WfsFeature {
  const { geometry: trash, ...properties } = olFeature.getProperties();
  const geometry = olFeature.getGeometry();

  if (!(geometry instanceof SimpleGeometry)) {
    throw new TypeError('Geometry is not SimpleGeometry');
  }

  const coordinates = geometry.getCoordinates();

  return {
    type: 'Feature',
    id: String(olFeature.getId()),
    ...(coordinates
      ? {
          geometry: {
            type: geometry.getType() as GeometryType,
            coordinates
          }
        }
      : {}),
    geometry_name: 'geometry',
    properties
  };
}

/**
 * Из {@link WfsFeature} формируем OpenLayer фичу {@link Feature}
 */
export function wfsFeatureToFeature(wfsFeature: WfsFeature): Feature<SimpleGeometry> {
  const olFeature = new Feature<SimpleGeometry>(
    wfsFeature.geometry
      ? {
          geometry: wfsGeometryToGeometry(wfsFeature.geometry)
        }
      : {}
  );

  olFeature.setId(wfsFeature.id);
  olFeature.setProperties(wfsFeature.properties);

  return olFeature;
}

export function wfsFeaturesToFeatures(features: WfsFeature[]): Feature<Geometry>[] {
  const result: Feature<Geometry>[] = [];
  features.forEach(feature => {
    result.push(wfsFeatureToFeature(feature));
  });

  return result;
}

export function wfsFeatureCollectionToFeature(featureCollection: WfsFeatureCollection): Feature<Geometry>[] {
  const result: Feature<Geometry>[] = [];
  featureCollection.features?.forEach(feature => {
    result.push(wfsFeatureToFeature(feature));
  });

  return result;
}

/**
 * Из {@link WfsGeometry} формируем OpenLayer {@link SimpleGeometry}
 */
export function wfsGeometryToGeometry(wfsGeometry: WfsGeometry<Coordinate>): SimpleGeometry {
  if (!wfsGeometry) {
    throw new Error('Некорректная геометрия');
  }

  switch (wfsGeometry.type) {
    case GeometryType.POINT: {
      return new Point(wfsGeometry.coordinates);
    }
    case GeometryType.MULTI_POINT: {
      return new MultiPoint(wfsGeometry.coordinates);
    }
    case GeometryType.LINE_STRING: {
      return new LineString(wfsGeometry.coordinates);
    }
    case GeometryType.MULTI_LINE_STRING: {
      return new MultiLineString(wfsGeometry.coordinates);
    }
    case GeometryType.POLYGON: {
      return new Polygon(wfsGeometry.coordinates);
    }
    case GeometryType.MULTI_POLYGON: {
      return new MultiPolygon(wfsGeometry.coordinates);
    }
    default: {
      throw new Error(`Неподдерживаемый тип геометрии: ${wfsGeometry.type}`);
    }
  }
}
