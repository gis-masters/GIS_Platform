import Feature from 'ol/Feature';
import { Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Point } from 'ol/geom';
import Polygon from 'ol/geom/Polygon';

import { defaultOlProjectionCode, Projection } from '../data/projections/projections.models';
import { getProjectionCode } from '../data/projections/projections.util';
import { roundCoordinate } from '../util/GeometryUtil';

export function mergeToMultiPolygon(
  features: Array<Feature<Geometry>>,
  proj: Projection | undefined
): Feature<MultiPolygon> {
  const allCoordinates: number[][][][] = [];

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
      allCoordinates.push(geomClone.getCoordinates());
    } else if (geomClone instanceof MultiPolygon) {
      allCoordinates.push(...geomClone.getCoordinates());
    }
  });

  // 2. Округляем координаты уже в целевой проекции
  const roundedCoordinates = allCoordinates.map(polygon =>
    polygon.map(ring => ring.map(coord => roundCoordinate(coord)))
  );

  return new Feature(new MultiPolygon(roundedCoordinates));
}

export function mergeToMultiLineString(
  features: Array<Feature<Geometry>>,
  proj: Projection | undefined
): Feature<MultiLineString> {
  const allCoordinates: number[][][] = [];

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
      allCoordinates.push(geomClone.getCoordinates());
    } else if (geomClone instanceof MultiLineString) {
      allCoordinates.push(...geomClone.getCoordinates());
    }
  });

  // 2. Округляем координаты уже в целевой проекции
  const roundedCoordinates = allCoordinates.map(line => line.map(coord => roundCoordinate(coord)));

  return new Feature(new MultiLineString(roundedCoordinates));
}

export function mergeToMultiPoint(
  features: Array<Feature<Geometry>>,
  proj: Projection | undefined
): Feature<MultiPoint> {
  const allCoordinates: number[][] = [];

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
      allCoordinates.push(geomClone.getCoordinates());
    } else if (geomClone instanceof MultiPoint) {
      allCoordinates.push(...geomClone.getCoordinates());
    }
  });

  // 2. Округляем координаты уже в целевой проекции
  const roundedCoordinates = allCoordinates.map(coord => roundCoordinate(coord));

  return new Feature(new MultiPoint(roundedCoordinates));
}
