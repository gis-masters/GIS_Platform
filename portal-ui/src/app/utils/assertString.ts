export function assertString(value: unknown, context?: string): string {
  if (typeof value !== 'string') {
    const ctx = context ? ` (${context})` : '';
    throw new TypeError(`Expected string${ctx}, got ${typeof value}: ${JSON.stringify(value)}`);
  }

  return value;
}
