export function isArrayOf<T>(value: unknown, tester: (item: T) => item is T): value is T[] {
  return Array.isArray(value) && value.every(tester);
}
