import { bearing, toWgs84 } from '@turf/turf';
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
import { FeatureLengthData, LabelPosition, LabelStyleOffsets, PointOnBisectorData, PointWithAngle } from './map.models';

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

export function getPointsAngles(coordinates: Coordinate[]): Omit<PointWithAngle, 'isLabelInPolygon'>[] {
  const pointsWithAngles: { angle: number; point: Coordinate }[] = [];

  for (let i = 0; i + 1 < coordinates.length; i += 1) {
    const pointA = coordinates[i === 0 ? coordinates.length - 1 : i - 1];
    const pointB = coordinates[i];
    const pointC = coordinates[i + 1];

    const angleA = bearing(pointA, pointB);
    const angleB = bearing(pointB, pointC);

    pointsWithAngles.push({ angle: angleB - angleA, point: pointB });
  }

  return pointsWithAngles;
}

// вычисляем положения label на основании азимута
// и находится ли точка внутри полигона или снаружи
export function getLabelPosition(angle: number, isPointInPolygon: boolean): LabelPosition {
  let vertical: 'top' | 'center' | 'bottom' = 'top';
  let horizontal: 'left' | 'center' | 'right' = 'right';

  if (angle < 22.5) {
    horizontal = 'center';
    if (isPointInPolygon) {
      vertical = 'bottom';
    }
  } else if (angle > 22.5 && angle < 67.5) {
    if (isPointInPolygon) {
      vertical = 'bottom';
      horizontal = 'left';
    }
  } else if (angle > 67.5 && angle < 112.5) {
    vertical = 'center';
    if (isPointInPolygon) {
      horizontal = 'left';
    }
  } else if (angle > 112.5 && angle < 157.5) {
    if (isPointInPolygon) {
      horizontal = 'left';
    } else {
      vertical = 'bottom';
    }
  } else if (angle > 157.5) {
    horizontal = 'center';
    if (!isPointInPolygon) {
      vertical = 'bottom';
    }
  }

  return { vertical, horizontal };
}

// создаем виртуальную линию по биссектрисе среднего угла для определения ее угла наклона относительно севера
// создаем смещенную по виртуальной линии точки чтобы получить проверку внутри заданного полигона или нет
export function getPointsWithAngles(coordinates: Coordinate[]): PointWithAngle[] {
  const pointsWithAngles: PointWithAngle[] = [];

  for (let i = 0; i < coordinates.length; i += 1) {
    const pointA = coordinates[i === 0 ? coordinates.length - 1 : i - 1];
    const pointB = coordinates[i];
    const pointC = coordinates[i + 1 === coordinates.length ? 0 : i + 1];

    const deltaX1 = pointA[0] - pointB[0];
    const deltaY1 = pointA[1] - pointB[1];
    const deltaX3 = pointC[0] - pointB[0];
    const deltaY3 = pointC[1] - pointB[1];
    const alpha = calculateAngle(deltaX1, deltaY1);
    const beta = calculateAngle(deltaX3, deltaY3);
    const bisector = calculateBisectorAngle(alpha, beta);
    const newPoint = calculatePointOnBisector(pointB[0], pointB[1], bisector, 1);
    const testPoint = [newPoint.bx, newPoint.by];
    const polygon = new Polygon([coordinates]);
    const isLabelInPolygon = polygon.intersectsCoordinate(testPoint);
    const angle = bearing(toWgs84(pointB), toWgs84(testPoint));

    pointsWithAngles.push({
      angle,
      point: pointB,
      isLabelInPolygon
    });
  }

  return pointsWithAngles;
}

// получаем офсеты для кооректного создания стилей (расположения лейблов относительно точек)
export function getLabelStyleOffsets({
  position,
  centred,
  isLabelInPolygon
}: Record<string, unknown>): LabelStyleOffsets {
  const offsets = {
    offsetX: 17,
    offsetY: -20
  };

  if (!!position && typeof position === 'object' && 'vertical' in position && 'horizontal' in position) {
    const { vertical, horizontal } = position;

    if (vertical === 'center') {
      offsets.offsetY = 0;
    } else if (vertical === 'bottom') {
      offsets.offsetY = 23;
    }

    if (horizontal === 'center') {
      offsets.offsetX = 0;
    } else if (horizontal === 'left') {
      offsets.offsetX = -23;
    }
  }

  if (centred) {
    offsets.offsetX = -14;
  }

  if (isLabelInPolygon) {
    offsets.offsetY = 20;
  }

  return offsets;
}

// Функция для перевода радиан в градусы
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
// Функция для нормализации угла в диапазоне от 0 до 360 градусов
export function normalizeAngle(angle: number): number {
  return (angle + 360) % 360;
}
// Функция для вычисления угла между вектором и осью X
export function calculateAngle(x: number, y: number): number {
  const angle = toDegrees(Math.atan2(y, x));

  return normalizeAngle(angle);
}

// Функция для вычисления биссектрисы угла между двумя векторами относительно оси X
function calculateBisectorAngle(alpha: number, beta: number): number {
  const angleDifference = Math.abs(alpha - beta);
  const halfAngle = angleDifference / 2;
  const minAngle = Math.min(alpha, beta);

  return normalizeAngle(minAngle + halfAngle);
}

// Функция для вычисления точки на биссектрисе с изменением x на deltaX
function calculatePointOnBisector(x2: number, y2: number, bisectorAngle: number, deltaX: number): PointOnBisectorData {
  if (deltaX === 0) {
    deltaX = 1;
  }
  const bisectorRadians = bisectorAngle * (Math.PI / 180);
  // Проверяем, чтобы угол не был вертикальным (90 или 270 градусов), чтобы избежать деления на ноль
  if (Math.cos(bisectorRadians) === 0) {
    // Если угол вертикальный, то y изменяется на deltaY, а x остается неизменным
    return {
      bx: x2,
      by: y2 + deltaX * Math.sign(Math.sin(bisectorRadians)) // deltaX здесь представляет deltaY
    };
  }
  // Вычисляем изменение по Y используя тангенс угла
  const deltaY = Math.tan(bisectorRadians) * deltaX;

  return {
    bx: x2 + deltaX,
    by: y2 + deltaY
  };
}
