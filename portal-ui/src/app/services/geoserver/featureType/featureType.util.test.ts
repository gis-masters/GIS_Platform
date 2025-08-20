import { describe, expect, test } from '@jest/globals';

import { extractFeatureId } from './featureType.util';

describe('feature util', () => {
  test('Допустимые идентификаторы объектов', () => {
    expect(extractFeatureId('1')).toEqual(1);
    expect(extractFeatureId('feature.1')).toEqual(1);
  });

  test('Некорректные параметры отклоняются с ошибкой', () => {
    expect(() => {
      extractFeatureId('');
    }).toThrow("Передан некорректный идентификатор объекта: ''");

    expect(() => {
      extractFeatureId('  ');
    }).toThrow("Передан некорректный идентификатор объекта: '  '");

    expect(() => {
      // @ts-expect-error -- так надо
      extractFeatureId(null);
    }).toThrow("Передан некорректный идентификатор объекта: 'null'");

    expect(() => {
      extractFeatureId('feature');
    }).toThrow("Передан некорректный идентификатор объекта: 'feature'");

    expect(() => {
      extractFeatureId('feature:1');
    }).toThrow("Передан некорректный идентификатор объекта: 'feature:1'");

    expect(() => {
      extractFeatureId('feature.some');
    }).toThrow("Передан некорректный идентификатор объекта: 'feature.some'");
  });
});
