import { type Coordinate } from 'ol/coordinate';

import { isArray } from './isArray';
import { isNumberArray } from './isNumberArray';

export function isCoordinate(value: unknown): value is Coordinate {
  return isNumberArray(value);
}

export function isCoordinateArray(value: unknown): value is Coordinate[] {
  return isArray(value) && value.every(item => isNumberArray(item));
}

export function isCoordinateArrayArray(value: unknown): value is Coordinate[][] {
  return isArray(value) && value.every(part => isCoordinateArray(part));
}

export function isMultiPolygonCoordinate(value: unknown): value is Coordinate[][][] {
  return isArray(value) && value.every(part => isCoordinateArrayArray(part));
}
