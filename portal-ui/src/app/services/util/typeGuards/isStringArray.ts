export function isStringArray(values: unknown): values is string[] {
  if (!Array.isArray(values)) {
    return false;
  }

  for (const value of values) {
    if (typeof value !== 'string') {
      return false;
    }
  }

  return true;
}
