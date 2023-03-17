import { LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon, SimpleGeometry } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';

import { GeometryType, WfsFeature, WfsGeometry } from '../geoserver/wfs/wfs.models';
import { Toast } from '../../components/Toast/Toast';

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
 * Из {@link WfsFeature} формируем OpenLayer фичу {@link Feature}
 */
export function wfsFeatureToFeature(
  wfsFeature: WfsFeature,
  suppressError?: boolean
): Feature<SimpleGeometry> | undefined {
  if (!wfsFeature.geometry) {
    if (!suppressError) {
      Toast.error({
        message: 'Ошибка отображения объекта',
        details: `ID: ${wfsFeature.id}.
                    Нет геометрии.`
      });
    }

    return;
  }

  return new Feature<SimpleGeometry>({
    geometry: wfsGeometryToGeometry(wfsFeature.geometry)
  });
}

/**
 * Из {@link WfsGeometry} формируем OpenLayer {@link Geometry}
 */
export function wfsGeometryToGeometry(wfsGeometry: WfsGeometry<Coordinate>): SimpleGeometry | undefined {
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

export function formatArea(polygon: Polygon, units: UnitsOfAreaMeasurement): [number, UnitsOfAreaMeasurement] {
  const area = getArea(polygon);
  let value: number;
  let outputUnits: UnitsOfAreaMeasurement;

  if (units === UnitsOfAreaMeasurement.HECTARE) {
    if (area > 100) {
      value = Math.round((area / 10_000) * 100) / 100;
      outputUnits = UnitsOfAreaMeasurement.HECTARE;
    } else {
      value = Math.round(area * 100) / 100;
      outputUnits = UnitsOfAreaMeasurement.SQUARE_METER;
    }
  } else if (area > 10_000) {
    value = Math.round((area / 1_000_000) * 100) / 100;
    outputUnits = UnitsOfAreaMeasurement.SQUARE_KILOMETER;
  } else {
    value = Math.round(area * 100) / 100;
    outputUnits = UnitsOfAreaMeasurement.SQUARE_METER;
  }

  return [value, outputUnits];
}

export function formatLength(line: LineString): [number, UnitsOfLengthMeasurement] {
  const length = getLength(line);
  let value: number;
  let outputUnits: UnitsOfLengthMeasurement;

  if (length > 100) {
    value = Math.round((length / 1000) * 100) / 100;
    outputUnits = UnitsOfLengthMeasurement.KILOMETER;
  } else {
    value = Math.round(length * 100) / 100;
    outputUnits = UnitsOfLengthMeasurement.METER;
  }

  return [value, outputUnits];
}
