import { Coordinate } from 'ol/coordinate';
import { Geometry, LineString, MultiLineString, MultiPoint, MultiPolygon, Polygon } from 'ol/geom';
import Point from 'ol/geom/Point';
import RenderFeature from 'ol/render/Feature';

import { services } from '../services';

export function convertToFlatMultiPoint(geometry: Geometry | RenderFeature): MultiPoint {
  try {
    if (geometry.getType() === 'Polygon') {
      return new MultiPoint(groupFlatCoordinates((geometry as Polygon).getFlatCoordinates()));
    } else if (geometry.getType() === 'MultiPolygon') {
      return new MultiPoint(groupFlatCoordinates((geometry as MultiPolygon).getFlatCoordinates()));
    } else if (geometry.getType() === 'LineString') {
      return new MultiPoint(groupFlatCoordinates((geometry as LineString).getFlatCoordinates()));
    } else if (geometry.getType() === 'MultiLineString') {
      return new MultiPoint(groupFlatCoordinates((geometry as MultiLineString).getFlatCoordinates()));
    } else if (geometry.getType() === 'Point') {
      return new MultiPoint([(geometry as Point).getCoordinates()]);
    }

    services.logger.warn(`Не поддерживаемый тип геометрии: ${geometry.getType()}`);

    return new MultiPoint([]);
  } catch (error) {
    services.logger.warn('Не удалось конвертировать геометрию в массив точек', error);

    return new MultiPoint([]);
  }
}

function groupFlatCoordinates(flatList: number[]): Coordinate[] {
  if (flatList.length % 2 !== 0) {
    throw new Error('The flat list must contain an even number of elements.');
  }

  const groupedCoordinates: Coordinate[] = [];
  for (let i = 0; i < flatList.length; i += 2) {
    groupedCoordinates.push([flatList[i], flatList[i + 1]]);
  }

  return groupedCoordinates;
}
