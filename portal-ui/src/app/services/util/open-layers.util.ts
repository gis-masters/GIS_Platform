import { Geometry, LineString, MultiLineString, MultiPolygon, Point, Polygon } from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';
import { getArea, getLength } from 'ol/sphere';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';

import { WfsFeature, WfsGeometry } from '../geoserver/wfs.models';
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
export function wfsFeatureToFeature(wfsFeature: WfsFeature, supressError?: boolean): Feature | undefined {
  if (!wfsFeature.geometry) {
    if (!supressError) {
      Toast.error({
        message: 'Ошибка отображения объекта',
        details: `ID: ${wfsFeature.id}.
                    Нет геометрии.`
      });
    }

    return;
  }
  return new Feature({
    geometry: wfsGeometryToGeometry(wfsFeature.geometry as WfsGeometry<Coordinate>)
  });
}

/**
 * Из {@link WfsGeometry} формируем OpenLayer {@link Geometry}
 */
export function wfsGeometryToGeometry(wfsGeometry: WfsGeometry<Coordinate>): Geometry | undefined | void {
  if (!wfsGeometry) {
    Toast.error('Некорректная геометрия');

    return;
  }

  switch (wfsGeometry.type) {
    case GeometryType.POINT:
      return new Point(wfsGeometry.coordinates);
    case GeometryType.MULTI_POLYGON:
      return new MultiPolygon(wfsGeometry.coordinates);
    case GeometryType.MULTI_LINE_STRING:
      return new MultiLineString(wfsGeometry.coordinates);
    default:
      Toast.error(`Not supported geometry type: ${wfsGeometry.type}`);
  }
}

export function formatArea(polygon: Polygon, units: UnitsOfAreaMeasurement): [number, UnitsOfAreaMeasurement] {
  const area = getArea(polygon);
  let value: number;
  let outputUnits: UnitsOfAreaMeasurement;

  if (units === UnitsOfAreaMeasurement.HECTARE) {
    if (area > 100) {
      value = Math.round((area / 10000) * 100) / 100;
      outputUnits = UnitsOfAreaMeasurement.HECTARE;
    } else {
      value = Math.round(area * 100) / 100;
      outputUnits = UnitsOfAreaMeasurement.SQUARE_METER;
    }
  } else {
    if (area > 10000) {
      value = Math.round((area / 1000000) * 100) / 100;
      outputUnits = UnitsOfAreaMeasurement.SQUARE_KILOMETER;
    } else {
      value = Math.round(area * 100) / 100;
      outputUnits = UnitsOfAreaMeasurement.SQUARE_METER;
    }
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
