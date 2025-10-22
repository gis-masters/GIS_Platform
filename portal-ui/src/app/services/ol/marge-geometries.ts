import Feature from 'ol/Feature';
import { type Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point } from 'ol/geom';
import Polygon from 'ol/geom/Polygon';

import { defaultOlProjectionCode, type Projection } from '../data/projections/projections.models';
import { getProjectionCode } from '../data/projections/projections.util';
import { roundCoordinate } from '../util/GeometryUtil';

// Функция для проверки, является ли геометрия пустой (все координаты равны 0)
function isEmptyGeometry(coordinates: number[][][]): boolean {
  return coordinates.every((polygon: number[][]) =>
    polygon.every((ring: number[]) => ring.every((coord: number) => Math.round(coord) === 0))
  );
}

// Функция для проверки, является ли линия пустой (все координаты равны 0)
function isEmptyLine(coordinates: number[][]): boolean {
  return coordinates.every((coord: number[]) => Math.round(coord[0]) === 0 && Math.round(coord[1]) === 0);
}

// Функция для проверки, является ли точка пустой (координаты равны 0)
function isEmptyPoint(coordinates: number[]): boolean {
  return Math.round(coordinates[0]) === 0 && Math.round(coordinates[1]) === 0;
}

export function mergeToMultiPolygon(
  features: Array<Feature<Geometry>>,
  proj: Projection | undefined
): Feature<MultiPolygon> {
  const allCoordinates: number[][][][] = [];
  const drawnCoordinates: number[][][][] = [];

  // 1. Собираем все полигоны и преобразуем их в целевую проекцию
  features.forEach(feature => {
    const geom = feature.getGeometry();
    if (!geom) {
      return;
    }

    // Клонируем геометрию, чтобы не менять исходную
    const geomClone = geom.clone();

    if (proj) {
      geomClone.transform(defaultOlProjectionCode, getProjectionCode(proj));
    }

    if (geomClone instanceof Polygon) {
      const coords = geomClone.getCoordinates();
      // Проверяем, является ли это нарисованной геометрией (без ID)
      if (feature.getId()) {
        allCoordinates.push(coords);
      } else {
        drawnCoordinates.push(coords);
      }
    } else if (geomClone instanceof MultiPolygon) {
      const coords = geomClone.getCoordinates();
      // Проверяем, является ли это нарисованной геометрией (без ID)
      if (feature.getId()) {
        allCoordinates.push(...coords);
      } else {
        drawnCoordinates.push(...coords);
      }
    }
  });

  // 2. Если есть нарисованные координаты, заменяем пустые геометрии
  let finalCoordinates = allCoordinates;
  if (drawnCoordinates.length > 0) {
    // Удаляем пустые геометрии (все координаты равны 0)
    finalCoordinates = allCoordinates.filter(coords => !isEmptyGeometry(coords));
    // Добавляем нарисованные координаты
    finalCoordinates.push(...drawnCoordinates);
  }

  // 3. Округляем координаты уже в целевой проекции
  const roundedCoordinates = finalCoordinates.map(polygon =>
    polygon.map(ring => ring.map(coord => roundCoordinate(coord)))
  );

  return new Feature(new MultiPolygon(roundedCoordinates));
}

export function mergeToMultiLineString(
  features: Array<Feature<Geometry>>,
  proj: Projection | undefined
): Feature<MultiLineString> {
  const allCoordinates: number[][][] = [];
  const drawnCoordinates: number[][][] = [];

  // 1. Собираем все линии и преобразуем их в целевую проекцию
  features.forEach(feature => {
    const geom = feature.getGeometry();
    if (!geom) {
      return;
    }

    // Клонируем геометрию, чтобы не менять исходную
    const geomClone = geom.clone();

    if (proj) {
      geomClone.transform(defaultOlProjectionCode, getProjectionCode(proj));
    }

    if (geomClone instanceof LineString) {
      const coords = geomClone.getCoordinates();
      // Проверяем, является ли это нарисованной геометрией (без ID)
      if (feature.getId()) {
        allCoordinates.push(coords);
      } else {
        drawnCoordinates.push(coords);
      }
    } else if (geomClone instanceof MultiLineString) {
      const coords = geomClone.getCoordinates();
      // Проверяем, является ли это нарисованной геометрией (без ID)
      if (feature.getId()) {
        allCoordinates.push(...coords);
      } else {
        drawnCoordinates.push(...coords);
      }
    }
  });

  // 2. Если есть нарисованные координаты, заменяем пустые линии
  let finalCoordinates = allCoordinates;
  if (drawnCoordinates.length > 0) {
    // Удаляем пустые линии (все координаты равны 0)
    finalCoordinates = allCoordinates.filter(coords => !isEmptyLine(coords));
    // Добавляем нарисованные координаты
    finalCoordinates.push(...drawnCoordinates);
  }

  // 3. Округляем координаты уже в целевой проекции
  const roundedCoordinates = finalCoordinates.map(line => line.map(coord => roundCoordinate(coord)));

  return new Feature(new MultiLineString(roundedCoordinates));
}

export function mergeToMultiPoint(
  features: Array<Feature<Geometry>>,
  proj: Projection | undefined
): Feature<MultiPoint> {
  const allCoordinates: number[][] = [];
  const drawnCoordinates: number[][] = [];

  // 1. Собираем все точки и преобразуем их в целевую проекцию
  features.forEach(feature => {
    const geom = feature.getGeometry();
    if (!geom) {
      return;
    }

    // Клонируем геометрию, чтобы не менять исходную
    const geomClone = geom.clone();

    if (proj) {
      geomClone.transform(defaultOlProjectionCode, getProjectionCode(proj));
    }

    if (geomClone instanceof Point) {
      const coords = geomClone.getCoordinates();
      // Проверяем, является ли это нарисованной геометрией (без ID)
      if (feature.getId()) {
        allCoordinates.push(coords);
      } else {
        drawnCoordinates.push(coords);
      }
    } else if (geomClone instanceof MultiPoint) {
      const coords = geomClone.getCoordinates();
      // Проверяем, является ли это нарисованной геометрией (без ID)
      if (feature.getId()) {
        allCoordinates.push(...coords);
      } else {
        drawnCoordinates.push(...coords);
      }
    }
  });

  // 2. Если есть нарисованные координаты, заменяем пустые точки
  let finalCoordinates = allCoordinates;
  if (drawnCoordinates.length > 0) {
    // Удаляем пустые точки (координаты равны 0)
    finalCoordinates = allCoordinates.filter(coords => !isEmptyPoint(coords));
    // Добавляем нарисованные координаты
    finalCoordinates.push(...drawnCoordinates);
  }

  // 3. Округляем координаты уже в целевой проекции
  const roundedCoordinates = finalCoordinates.map(coord => roundCoordinate(coord));

  return new Feature(new MultiPoint(roundedCoordinates));
}
