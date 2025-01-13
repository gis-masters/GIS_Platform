import { bearing, toWgs84 } from '@turf/turf';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { SimpleGeometry } from 'ol/geom';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { getArea, getLength } from 'ol/sphere';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';

import { getProjectionCode, getProjectionUnit } from '../../data/projections/projections.util';
import { GeometryType } from '../../geoserver/wfs/wfs.models';
import { UnitsOfAreaMeasurement, UnitsOfLengthMeasurement } from '../../util/open-layers.util';
import { isArrayOf } from '../../util/typeGuards/isArrayOf';
import { isCircleProperties } from '../../util/typeGuards/isCircleProperties';
import { isCoordinateArray, isCoordinateArrayArray } from '../../util/typeGuards/isCoordinate';
import { isLabelTextProperties } from '../../util/typeGuards/isLabelTextProperties';
import { isNumberArray } from '../../util/typeGuards/isNumberArray';
import {
  FeatureAreaData,
  FeatureFontStringData,
  FeatureLengthData,
  FontProperties,
  isTextAlignTypes,
  LabelPosition,
  LabelStyleOffsets,
  PointOnBisectorData,
  PointWithAngle,
  TextAlignTypes,
  TextProperties
} from './map-labels.models';

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

export function getFeatureArea({
  geometry,
  units,
  projection,
  precision
}: FeatureAreaData): [number, UnitsOfAreaMeasurement] {
  if (!(geometry instanceof Polygon) && !(geometry instanceof MultiPolygon)) {
    throw new TypeError('Невозможно высчитать площадь объекта');
  }

  const area = projection
    ? getArea(geometry, { projection: typeof projection === 'string' ? projection : getProjectionCode(projection) })
    : geometry.getArea();

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

// создаем виртуальную линию по биссектрисе среднего угла для определения ее угла наклона относительно азимута
// создаем смещенную по виртуальной линии точки, чтобы получить проверку внутри заданного полигона или нет
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

// получаем офсеты для корректного создания стилей (расположения лейблов относительно точек)
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

export function getTextProperties(properties: Record<string, unknown>): TextProperties {
  const { centred, textProperties } = properties;

  let fontSize = 18;
  let bold = '';
  let italic = '';
  let color = '#141414';
  let align: TextAlignTypes = 'left';

  if (centred) {
    fontSize = 14;
  }

  if (textProperties && isLabelTextProperties(textProperties)) {
    const { fontSize: size, fontColor, isBold, isItalic, textAlign } = textProperties;
    if (size && typeof size === 'number') {
      fontSize = size;
    }

    if (isBold) {
      bold = 'bold';
    }

    if (isItalic) {
      italic = 'italic';
    }

    if (fontColor && typeof fontColor === 'string') {
      color = fontColor;
    }

    if (textAlign && isTextAlignTypes(textAlign)) {
      align = textAlign;
    }
  }

  return { fontSize, bold, italic, fontColor: color, textAlign: align };
}

export function getCircleStyle(feature?: Feature): Circle {
  let circleFillColor = '#FFA343';
  let circleStrokeColor = '#fff';
  let circleRadius = 6;

  const circleProperties: unknown = feature ? feature.getProperties().circleProperties : undefined;

  if (circleProperties && isCircleProperties(circleProperties)) {
    const { fillColor, strokeColor, radius } = circleProperties;

    if (fillColor && isValidHexColor(fillColor)) {
      circleFillColor = fillColor;
    }

    if (strokeColor && isValidHexColor(strokeColor)) {
      circleStrokeColor = strokeColor;
    }

    if (radius) {
      circleRadius = Number(radius);
    }
  }

  return new Circle({
    fill: new Fill({
      color: circleFillColor
    }),
    stroke: new Stroke({
      width: 1,
      color: circleStrokeColor
    }),
    radius: circleRadius
  });
}

export function getTextStyle(properties: Record<string, unknown>): Text {
  const { position, isLabelInPolygon, text, rotation, ...otherProperties } = properties;
  const { fontSize, bold, italic, fontColor, textAlign } = getTextProperties(otherProperties);
  const { offsetX, offsetY } = getLabelStyleOffsets({ position, centred: otherProperties.centred, isLabelInPolygon });

  return new Text({
    font: `${bold} ${italic} ${fontSize}px sans-serif`,
    textAlign: textAlign === 'justify' ? 'left' : textAlign,
    justify: textAlign === 'center' ? 'center' : 'left',
    offsetX,
    offsetY,
    text: typeof text === 'string' ? text : 'Ваш текст',
    stroke: new Stroke({
      color: properties.centred ? '#d3d3d3' : '#fff',
      width: 5
    }),
    rotation: rotation && typeof rotation === 'number' ? rotation : 0,
    fill: new Fill({
      color: fontColor
    }),
    padding: [5, 5, 3, 5]
  });
}

export function getFeatureStringValue(feature: Feature): string {
  const { text } = feature.getProperties();

  return String(text);
}

// получаем строку с характеристиками шрифта самой Feature
export function getFeatureFontString(feature: Feature): FeatureFontStringData {
  const style = feature.getStyle();
  let textAlign: TextAlignTypes = 'center';
  let font: string | undefined = undefined;
  let fontColor: number[] = [20, 20, 20, 1];

  if (style instanceof Style) {
    font = style.getText()?.getFont();
    const align = style.getText()?.getTextAlign();
    const justify = style.getText()?.getJustify();

    if (align && isTextAlignTypes(align)) {
      textAlign = align;
    }

    if (justify) {
      textAlign = 'justify';
    }
  }

  if (Array.isArray(style) && style[0] instanceof Style) {
    const color = style[0].getText()?.getFill()?.getColor();
    const align = style[0].getText()?.getTextAlign();
    const justify = style[0].getText()?.getJustify();

    if (color && isNumberArray(color)) {
      fontColor = color;
    }

    if (align && isTextAlignTypes(align)) {
      textAlign = align;
    }

    if (justify) {
      textAlign = 'justify';
    }

    font = style[0].getText()?.getFont();
  }

  return { font, fontColor, textAlign };
}

// получаем свойства шрифта из строки
export function getFeatureFontPropertiesByString(value?: string): Omit<FontProperties, 'fontColor' | 'textAlign'> {
  return {
    fontSize: value ? Number(value.match(/-?\d+/g)?.[0]) || 14 : 14,
    isBold: value ? /\bbold\b/i.test(value) : false,
    isItalic: value ? /\bitalic\b/i.test(value) : false
  };
}

// из RGBA возвращенный из OL делаем HEX. Там всегда массив из 4-х значений
export function convertFromRGBAToHEX([r, g, b, a]: number[]): string {
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  const hexR = ('0' + r.toString(16)).slice(-2);
  const hexG = ('0' + g.toString(16)).slice(-2);
  const hexB = ('0' + b.toString(16)).slice(-2);

  if (a === 1) {
    return `#${hexR}${hexG}${hexB}`;
  }

  const hexA = Math.round(a * 255);
  const hexAlpha = ('0' + hexA.toString(16)).slice(-2);

  return `#${hexR}${hexG}${hexB}${hexAlpha}`;
}

export function isValidHexColor(value: unknown): boolean {
  return !!value && typeof value === 'string' && value.includes('#') && value.length > 3 && value.length < 10;
}
