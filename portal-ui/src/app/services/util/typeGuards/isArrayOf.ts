import { isArray } from './isArray';

export function isArrayOf<T>(value: unknown, tester: (item: unknown) => item is T): value is T[] {
  return isArray(value) && value.every(tester);
}
