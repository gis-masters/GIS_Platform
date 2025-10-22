import { Feature } from 'ol';
import {
  type Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  SimpleGeometry
} from 'ol/geom';

import { GeometryType, type WfsFeature, type WfsGeometry } from '../geoserver/wfs/wfs.models';
import { services } from '../services';

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

  let wfsGeometry: WfsGeometry | undefined;

  if (geometry instanceof Point) {
    wfsGeometry = { type: GeometryType.POINT, coordinates: geometry.getCoordinates() };
  } else if (geometry instanceof MultiPoint) {
    wfsGeometry = { type: GeometryType.MULTI_POINT, coordinates: geometry.getCoordinates() };
  } else if (geometry instanceof LineString) {
    wfsGeometry = { type: GeometryType.LINE_STRING, coordinates: geometry.getCoordinates() };
  } else if (geometry instanceof MultiLineString) {
    wfsGeometry = { type: GeometryType.MULTI_LINE_STRING, coordinates: geometry.getCoordinates() };
  } else if (geometry instanceof Polygon) {
    wfsGeometry = { type: GeometryType.POLYGON, coordinates: geometry.getCoordinates() };
  } else if (geometry instanceof MultiPolygon) {
    wfsGeometry = { type: GeometryType.MULTI_POLYGON, coordinates: geometry.getCoordinates() };
  } else {
    throw new TypeError(`Неподдерживаемый тип геометрии: ${geometry.getType()}`);
  }

  return {
    type: 'Feature',
    id: String(olFeature.getId()),
    geometry: wfsGeometry,
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

export function wfsFeaturesToOlFeatures(wfsFeatures: WfsFeature[]): Feature<SimpleGeometry>[] {
  const result: Feature<SimpleGeometry>[] = [];

  for (const wfsFeature of wfsFeatures) {
    if (!wfsFeature.geometry) {
      services.logger.error(`ID: ${wfsFeature.id}. Нет геометрии.`);

      continue;
    }

    try {
      const olFeature = wfsFeatureToFeature(wfsFeature);

      if (olFeature) {
        result.push(olFeature);
      }
    } catch (error) {
      services.logger.error(`Не удалось смапить wfs фичу в openlayers фичу: '${wfsFeature.id}'`, error);
    }
  }

  return result;
}

export function wfsFeaturesToFeatures(features: WfsFeature[]): Feature<Geometry>[] {
  const result: Feature<Geometry>[] = [];
  features.forEach(feature => {
    result.push(wfsFeatureToFeature(feature));
  });

  return result;
}

/**
 * Из {@link WfsGeometry} формируем OpenLayer {@link SimpleGeometry}
 */
export function wfsGeometryToGeometry(wfsGeometry: WfsGeometry): SimpleGeometry {
  if (!wfsGeometry) {
    throw new Error('Некорректная геометрия');
  }

  if (wfsGeometry.type === GeometryType.POINT) {
    return new Point(wfsGeometry.coordinates);
  }

  if (wfsGeometry.type === GeometryType.MULTI_POINT) {
    return new MultiPoint(wfsGeometry.coordinates);
  }

  if (wfsGeometry.type === GeometryType.LINE_STRING) {
    return new LineString(wfsGeometry.coordinates);
  }

  if (wfsGeometry.type === GeometryType.MULTI_LINE_STRING) {
    return new MultiLineString(wfsGeometry.coordinates);
  }

  if (wfsGeometry.type === GeometryType.POLYGON) {
    return new Polygon(wfsGeometry.coordinates);
  }

  if (wfsGeometry.type === GeometryType.MULTI_POLYGON) {
    return new MultiPolygon(wfsGeometry.coordinates);
  }

  throw new TypeError('Неподдерживаемый тип геометрии');
}
