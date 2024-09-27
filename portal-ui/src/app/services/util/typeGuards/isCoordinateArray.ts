import { Coordinate } from 'ol/coordinate';

import { isNumberArray } from './isNumberArray';

export function isCoordinateArray(value: unknown): value is Coordinate[] {
  return Array.isArray(value) && value.every(item => isNumberArray(item));
}
