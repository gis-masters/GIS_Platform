import { Coordinate } from 'ol/coordinate';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { getLength } from 'ol/sphere';

import { Projection } from '../data/projections/projections.models';
import {
  transformCoord,
  transformGroup,
  transformMultiSuperGroup,
  transformSuperGroup
} from '../data/projections/projections.util';
import { GeometryType } from '../geoserver/wfs/wfs.models';
import { UnitsOfAreaMeasurement, UnitsOfLengthMeasurement } from '../util/open-layers.util';
import { isArrayOf } from '../util/typeGuards/isArrayOf';
import { isCoordinate, isCoordinateArray, isCoordinateArrayArray } from '../util/typeGuards/isCoordinate';
import { isNumberArray } from '../util/typeGuards/isNumberArray';

// азимут отраженный в градусах преобразуется в радианы с учетом разности смещения нулевой точки
export function getRotationByAzimuth(azimuth: number): number {
  const rotation = (3.14 / 180) * azimuth;

  return rotation > 0 ? rotation - 1.57 : rotation + 1.57;
}

export function getFeatureLengthByGeometry(
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][],
  geometryType: GeometryType
): { length: number; middlePoints: Point[] } {
  if (geometryType === GeometryType.MULTI_POLYGON && isArrayOf(coordinates, isCoordinateArrayArray)) {
    const multiPolygon = new MultiPolygon(coordinates);

    return {
      length: multiPolygon.getPolygons().reduce((acc, value) => acc + getLength(value, { projection: 'EPSG:3857' }), 0),
      middlePoints: multiPolygon.getInteriorPoints().getPoints()
    };
  }
  if (geometryType === GeometryType.POLYGON && isCoordinateArrayArray(coordinates)) {
    const polygon = new Polygon(coordinates);

    return { length: getLength(polygon), middlePoints: [polygon.getInteriorPoint()] };
  }

  if (
    geometryType === GeometryType.MULTI_LINE_STRING &&
    (isCoordinate(coordinates) || isCoordinateArrayArray(coordinates) || isNumberArray(coordinates))
  ) {
    const multiLineString = new MultiLineString(coordinates);

    return {
      length: multiLineString
        .getLineStrings()
        .reduce((acc, value) => acc + getLength(value, { projection: 'EPSG:3857' }), 0),
      middlePoints: multiLineString.getLineStrings().map(lineString => new Point(lineString.getFlatMidpoint()))
    };
  }

  if (geometryType === GeometryType.LINE_STRING && (isCoordinate(coordinates) || isCoordinateArray(coordinates))) {
    const lineString = new LineString(coordinates);

    return { length: getLength(lineString), middlePoints: [new Point(lineString.getFlatMidpoint())] };
  }

  throw new Error('Тип геометрии не позволяет определить периметр объекта');
}

export function getFeatureSquareByGeometry(
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][],
  geometryType: GeometryType
): { value: number; middlePoints: Point[] } {
  if (
    geometryType === GeometryType.MULTI_POLYGON &&
    coordinates.every(coordinate => isArrayOf(coordinate, isCoordinateArray))
  ) {
    const multiPolygon = new MultiPolygon(coordinates as Coordinate[][][]);

    return {
      value: multiPolygon.getArea(),
      middlePoints: multiPolygon.getInteriorPoints().getPoints()
    };
  }
  if (geometryType === GeometryType.POLYGON && isArrayOf(coordinates, isCoordinateArray)) {
    const polygon = new Polygon(coordinates);

    return { value: polygon.getArea(), middlePoints: [polygon.getInteriorPoint()] };
  }

  throw new Error('Тип геометрии не позволяет определить периметр объекта');
}

export function transformAnyCoordinates(
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][],
  projFrom: Projection,
  projTo: Projection
): false | Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][] {
  if (isCoordinate(coordinates)) {
    const olCoordinates = transformCoord(coordinates, projFrom, projTo);

    return isNumberArray(olCoordinates) && olCoordinates;
  }
  if (isCoordinateArray(coordinates)) {
    const olCoordinates = transformGroup(coordinates, projFrom, projTo);

    return isCoordinateArray(olCoordinates) && olCoordinates;
  }
  if (isArrayOf(coordinates, isCoordinateArray)) {
    const olCoordinates = transformSuperGroup(coordinates, projFrom, projTo);

    return isArrayOf(olCoordinates, isCoordinateArray) && olCoordinates;
  }

  const olCoordinates = transformMultiSuperGroup(coordinates, projFrom, projTo);

  return isArrayOf(olCoordinates, isCoordinateArrayArray) && olCoordinates;
}

export function getMeasureUnitsByType(value: number, type?: 'square'): { value: number; units: string } {
  let fixedValue: number;
  let outputUnits: UnitsOfLengthMeasurement | UnitsOfAreaMeasurement;

  if (type === 'square') {
    if (value > 1000) {
      fixedValue = fixedValue = Math.round((value / 10_000) * 1000) / 1000;
      outputUnits = UnitsOfAreaMeasurement.HECTARE;
    } else {
      fixedValue = value;
      outputUnits = UnitsOfAreaMeasurement.SQUARE_METER;
    }

    return { value: Number(fixedValue.toFixed(2)), units: outputUnits };
  }

  if (value > 100) {
    fixedValue = Math.round((value / 1000) * 100) / 100;
    outputUnits = UnitsOfLengthMeasurement.KILOMETER;
  } else {
    fixedValue = Math.round(value * 100) / 100;
    outputUnits = UnitsOfLengthMeasurement.METER;
  }

  return { value: fixedValue, units: outputUnits };
}
