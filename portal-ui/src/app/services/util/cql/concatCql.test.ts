import { describe, expect, test } from '@jest/globals';

import { concatCql } from './concatCql';

describe('concat cql', () => {
  const filter1 = "(propertyName = 'someValue')";
  const filter2 = "(anotherPropertyName IN('value1','value2') OR (anotherPropertyName IS null))";
  const filter3 = "(propertyName ILIKE '%someValue%')";
  const filter4 = '';
  const filter5: null = null;
  const filter6: undefined = undefined;

  test('CQL-фильтры объединяются оператором AND', () => {
    const expected = `${filter1} AND ${filter2} AND ${filter3}`;
    expect(concatCql(filter1, filter2, filter3)).toBe(expected);
  });

  test('если передать только один фильтр то он останется без изменений', () => {
    expect(concatCql(filter1)).toBe(filter1);
  });

  test('можно передавать пустые фильтры, они будут проигнорированы', () => {
    expect(concatCql(filter1, filter5, filter6, filter4)).toBe(filter1);
  });
});
