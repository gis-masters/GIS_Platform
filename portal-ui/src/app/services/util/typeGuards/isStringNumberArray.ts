export function isStringNumberArray(values: unknown): values is (number | string)[] {
  if (!Array.isArray(values)) {
    return false;
  }

  for (const value of values) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return false;
    }
  }

  return true;
}
