import { describe, expect, test } from '@jest/globals';

import { extractFeatureId } from './feature.util';

describe('feature util', () => {
  test('Допустимые идентификаторы объектов', () => {
    expect(extractFeatureId('1')).toEqual(1);
    expect(extractFeatureId('feature.1')).toEqual(1);
  });

  test('Некорректные параметры откланяются с ошибкой', () => {
    expect(() => {
      extractFeatureId('');
    }).toThrow("Передан некорректный идентификатор фичи: ''");

    expect(() => {
      extractFeatureId('  ');
    }).toThrow("Передан некорректный идентификатор фичи: '  '");

    expect(() => {
      extractFeatureId(null);
    }).toThrow("Передан некорректный идентификатор фичи: 'null'");

    expect(() => {
      extractFeatureId('feature');
    }).toThrow("Передан некорректный идентификатор фичи: 'feature'");

    expect(() => {
      extractFeatureId('feature:1');
    }).toThrow("Передан некорректный идентификатор фичи: 'feature:1'");

    expect(() => {
      extractFeatureId('feature.some');
    }).toThrow("Передан некорректный идентификатор фичи: 'feature.some'");
  });
});
