import { Coordinate } from 'ol/coordinate';
import { parse } from 'papaparse';

import { isCoordinate } from './typeGuards/isCoordinate';

export const systemFormat = 'YYYY-MM-DD';

export function extractCoordinates(csv: string): Coordinate[] {
  const result = parse(csv, { skipEmptyLines: 'greedy' });

  if (result.errors.length) {
    throw new Error('Ошибка чтения CSV');
  }

  return result.data
    .map(point => {
      if (!Array.isArray(point)) {
        throw new TypeError('Некорректная геометрия');
      }

      const numericPoint = point.map(Number);

      if (!isCoordinate(numericPoint) || numericPoint.some(coord => Number.isNaN(coord))) {
        throw new Error('Некорректная геометрия');
      }

      numericPoint.reverse();

      return numericPoint;
    })
    .filter((point): point is Coordinate => point !== undefined)
    .filter((point: Coordinate) => !Number.isNaN(point[0]) && !Number.isNaN(point[1]));
}
