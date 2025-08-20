export function isNumberArray(values: unknown): values is number[] {
  if (!Array.isArray(values)) {
    return false;
  }

  for (const value of values) {
    if (typeof value !== 'number') {
      return false;
    }
  }

  return true;
}
