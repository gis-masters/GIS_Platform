import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { SimpleGeometry } from 'ol/geom';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { getLength } from 'ol/sphere';

import { currentProject } from '../../stores/CurrentProject.store';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { defaultOlProjectionCode, Projection } from '../data/projections/projections.models';
import { getProjectionByCode } from '../data/projections/projections.service';
import {
  getProjectionCode,
  getProjectionUnit,
  transformCoord,
  transformGroup,
  transformMultiSuperGroup,
  transformSuperGroup
} from '../data/projections/projections.util';
import { extractTableNameFromFeatureId } from '../geoserver/featureType/featureType.util';
import { GeometryType, supportedGeometryTypes, WfsFeature } from '../geoserver/wfs/wfs.models';
import { UnitsOfAreaMeasurement, UnitsOfLengthMeasurement } from '../util/open-layers.util';
import { isArrayOf } from '../util/typeGuards/isArrayOf';
import { isCoordinate, isCoordinateArray, isCoordinateArrayArray } from '../util/typeGuards/isCoordinate';
import { isNumberArray } from '../util/typeGuards/isNumberArray';
import { FeatureLengthData } from './map.models';

const geometryError = 'Тип геометрии не позволяет определить периметр объекта';

function calculateLengthCustom(coordinates: number[][]): number {
  let totalLength = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[i + 1];

    const dx = x2 - x1;
    const dy = y2 - y1;

    const distance = Math.hypot(dx, dy);

    totalLength += distance;
  }

  return totalLength;
}

// азимут отраженный в градусах преобразуется в радианы с учетом разности смещения нулевой точки
export function getRotationByAzimuth(azimuth: number): number {
  const rotation = (3.14 / 180) * azimuth;

  return rotation > 0 ? rotation - 1.57 : rotation + 1.57;
}

// получаем протяженность средствами OpenLayers
function getLengthByOl(
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][],
  geometryType: GeometryType,
  projection?: string
): { length: number; middlePoints: Point[] } {
  if (
    geometryType === GeometryType.MULTI_LINE_STRING &&
    (isCoordinate(coordinates) || isCoordinateArrayArray(coordinates) || isNumberArray(coordinates))
  ) {
    const multiLineString = new MultiLineString(coordinates);

    return {
      length: getLength(multiLineString, { projection: projection || defaultOlProjectionCode }),
      middlePoints: multiLineString.getLineStrings().map(lineString => new Point(lineString.getFlatMidpoint()))
    };
  }

  if (geometryType === GeometryType.LINE_STRING && (isCoordinate(coordinates) || isCoordinateArray(coordinates))) {
    const lineString = new LineString(coordinates);

    return {
      length: getLength(lineString, { projection: projection || defaultOlProjectionCode }),
      middlePoints: [new Point(lineString.getFlatMidpoint())]
    };
  }

  throw new Error(geometryError);
}

export function getFeatureLengthByGeometry({
  coordinates,
  geometryType,
  units,
  projection
}: {
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][];
  geometryType: GeometryType;
  units?: string;
  projection?: string;
}): { length: number; middlePoints: Point[] } {
  if (geometryType === GeometryType.MULTI_POLYGON && isArrayOf(coordinates, isCoordinateArrayArray)) {
    const multiPolygon = new MultiPolygon(coordinates);

    return {
      length: getLength(multiPolygon, { projection: projection || defaultOlProjectionCode }),
      middlePoints: multiPolygon.getInteriorPoints().getPoints()
    };
  }

  if (geometryType === GeometryType.POLYGON && isCoordinateArrayArray(coordinates)) {
    const polygon = new Polygon(coordinates);

    return {
      length: getLength(polygon, { projection: projection || defaultOlProjectionCode }),
      middlePoints: [polygon.getInteriorPoint()]
    };
  }

  // отдает более точное (в соответствие с Росреестром) значение
  if (units === 'метры') {
    if (geometryType === GeometryType.LINE_STRING && isCoordinateArray(coordinates)) {
      const lineString = new LineString(coordinates);

      return { length: calculateLengthCustom(coordinates), middlePoints: [new Point(lineString.getFlatMidpoint())] };
    }

    if (geometryType === GeometryType.MULTI_LINE_STRING && isCoordinateArrayArray(coordinates)) {
      const multiLineString = new MultiLineString(coordinates);
      const lineStrings = multiLineString.getLineStrings();

      return {
        length: lineStrings.reduce((acc, lineString) => {
          const coords = lineString.getCoordinates();

          return acc + calculateLengthCustom(coords);
        }, 0),
        middlePoints: multiLineString.getLineStrings().map(lineString => new Point(lineString.getFlatMidpoint()))
      };
    }
  } else {
    return getLengthByOl(coordinates, geometryType, projection);
  }

  throw new Error(geometryError);
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

// если выделена всего одна фича - то возвращаем ее
// если выделено несколько и одна из них открыта для редактирования - то возвращаем открытую
// иначе undefined
export function getSelectedOrActiveFeature(): WfsFeature | null {
  const selectedFeatureId = sidebars.editFeaturesData?.features[0].id;
  const selectedFeature = selectedFeatureId
    ? mapStore.getFeatureInSelectionById(selectedFeatureId)
    : mapStore.selectedFeatures[0];

  return selectedFeature || null;
}

export function getDecarticFeatureLength(geometry: SimpleGeometry): number {
  let coordinates = geometry.getCoordinates();
  const geometryType = geometry.getType();

  if (geometryType === GeometryType.LINE_STRING && isCoordinateArray(coordinates)) {
    return calculateLengthCustom(coordinates);
  }

  if (isArrayOf(coordinates, isCoordinateArrayArray)) {
    coordinates = coordinates.flat();
  }

  if (isCoordinateArrayArray(coordinates)) {
    let length: number = 0;

    for (const lineStringCoordinates of coordinates) {
      length += calculateLengthCustom(lineStringCoordinates);
    }

    return length;
  }

  return 0;
}

export function getMiddlePoints(feature: Feature<SimpleGeometry>): Point[] {
  const geometry = feature.getGeometry();
  const geometryType = geometry?.getType();

  if (!geometry || !geometryType) {
    return [];
  }

  if (geometry instanceof MultiPolygon) {
    return geometry.getInteriorPoints().getPoints();
  }

  if (geometry instanceof Polygon) {
    return [geometry.getInteriorPoint()];
  }

  if (geometry instanceof MultiLineString) {
    return geometry.getLineStrings().map(lineString => new Point(lineString.getFlatMidpoint()));
  }

  if (geometry instanceof LineString) {
    return [new Point(geometry.getFlatMidpoint())];
  }

  return [];
}

export async function getSelectedFeatureProjection(): Promise<Projection | undefined> {
  const selectedFeature = getSelectedOrActiveFeature();
  const layerTableName = selectedFeature ? extractTableNameFromFeatureId(selectedFeature.id) : null;

  if (!layerTableName) {
    throw new Error('Отсуствует векторная таблица');
  }

  const layer = currentProject.layers.find(layer => layer.tableName === layerTableName);

  const geometryType = selectedFeature?.geometry?.type;

  if (!geometryType || !supportedGeometryTypes.includes(geometryType)) {
    throw new Error('Неподдерживаемый тип геометрии');
  }

  if (!layer?.nativeCRS) {
    throw new Error('В слое не указана система координат');
  }

  return await getProjectionByCode(layer?.nativeCRS);
}

export function getFeatureArea(
  geometry: SimpleGeometry,
  units: UnitsOfAreaMeasurement,
  precision?: number
): [number, UnitsOfAreaMeasurement] {
  if (!(geometry instanceof Polygon) && !(geometry instanceof MultiPolygon)) {
    throw new TypeError('Невозможно высчитать площадь объекта');
  }

  const area = geometry.getArea();
  let value: number;
  let outputUnits: UnitsOfAreaMeasurement;

  if (units === UnitsOfAreaMeasurement.HECTARE) {
    if (area > 10_000) {
      value = Number((area / 10_000).toFixed(precision || 2));
      outputUnits = UnitsOfAreaMeasurement.HECTARE;
    } else {
      value = Number(area.toFixed(precision || 2));
      outputUnits = UnitsOfAreaMeasurement.SQUARE_METER;
    }
  } else if (area > 10_000) {
    value = Number((area / 1_000_000).toFixed(precision || 2));
    outputUnits = UnitsOfAreaMeasurement.SQUARE_KILOMETER;
  } else {
    value = Number(area.toFixed(precision || 2));
    outputUnits = UnitsOfAreaMeasurement.SQUARE_METER;
  }

  return [value, outputUnits];
}

export function getFeatureLength({
  geometry,
  projection,
  precision,
  isMeasure
}: FeatureLengthData): [number, UnitsOfLengthMeasurement] {
  const isMetric = !!getProjectionUnit(projection.srtext);

  const length =
    isMetric && !isMeasure
      ? getDecarticFeatureLength(geometry)
      : getLength(geometry, { projection: getProjectionCode(projection) });
  let value: number;
  let outputUnits: UnitsOfLengthMeasurement;

  if (length > 1000) {
    value = Number((length / 1000).toFixed(precision || 2));
    outputUnits = UnitsOfLengthMeasurement.KILOMETER;
  } else {
    value = Number(length.toFixed(precision || 2));
    outputUnits = UnitsOfLengthMeasurement.METER;
  }

  return [value, outputUnits];
}
