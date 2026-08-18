import { describe, expect, test } from '@jest/globals';

import { isReservedPropertyName } from './isReservedPropertyName';

describe('isReservedPropertyName', () => {
  test('имя true считается зарезервированным', () => {
    expect(isReservedPropertyName('true')).toBe(true);
  });

  test('имя TRUE в верхнем регистре считается зарезервированным', () => {
    expect(isReservedPropertyName('TRUE')).toBe(true);
  });

  test('имя false считается зарезервированным', () => {
    expect(isReservedPropertyName('false')).toBe(true);
  });

  test('имя FALSE в верхнем регистре считается зарезервированным', () => {
    expect(isReservedPropertyName('FALSE')).toBe(true);
  });

  test('имя true с пробелами считается зарезервированным', () => {
    expect(isReservedPropertyName(' true ')).toBe(true);
  });

  test('имя trueFlag не считается зарезервированным', () => {
    expect(isReservedPropertyName('trueFlag')).toBe(false);
  });

  test('имя false_positive не считается зарезервированным', () => {
    expect(isReservedPropertyName('false_positive')).toBe(false);
  });

  test('имя flag не считается зарезервированным', () => {
    expect(isReservedPropertyName('flag')).toBe(false);
  });
});
