import { describe, expect, test } from '@jest/globals';

import { buildCqlFilter } from './cql';

describe('cql builder', () => {
  test('свойство фильтра с простым значением преобразуется в равенство', () => {
    expect(buildCqlFilter({ propertyName: 'someValue' })).toBe("propertyName = 'someValue'");
  });

  test('свойство фильтра с оператором $eq преобразуется в равенство', () => {
    expect(buildCqlFilter({ propertyName: { $eq: 'someValue' } })).toBe("(propertyName = 'someValue')");
  });

  test('свойство фильтра с оператором $ne преобразуется в неравенство', () => {
    expect(buildCqlFilter({ propertyName: { $ne: 'someValue' } })).toBe("(propertyName <> 'someValue')");
  });

  test('свойство фильтра с оператором $like преобразуется в LIKE', () => {
    expect(buildCqlFilter({ propertyName: { $like: '%someValue%' } })).toBe("(propertyName LIKE '%someValue%')");
  });

  test('свойство фильтра с оператором $ilike преобразуется в ILIKE', () => {
    expect(buildCqlFilter({ propertyName: { $ilike: '%someValue%' } })).toBe("(propertyName ILIKE '%someValue%')");
  });

  test('свойство фильтра с оператором $in преобразуется в IN', () => {
    expect(buildCqlFilter({ propertyName: { $in: ['value1', 'value2'] } })).toBe(
      "(propertyName IN('value1','value2'))"
    );
  });

  test('свойство фильтра с оператором $in, содержащим null преобразуется в связку IN и IS null через OR', () => {
    expect(buildCqlFilter({ propertyName: { $in: ['value1', 'value2', null] } })).toBe(
      "((propertyName IN('value1','value2') OR propertyName IS null))"
    );
  });

  test('свойство фильтра с оператором $nin преобразуется в NOT ... IN', () => {
    expect(buildCqlFilter({ propertyName: { $nin: ['value1', 'value2'] } })).toBe(
      "(NOT (propertyName IN('value1','value2')))"
    );
  });

  test('свойство фильтра с оператором $nin, содержащим null преобразуется в связку NOT ... IN и IS NOT null через AND', () => {
    expect(buildCqlFilter({ propertyName: { $nin: ['value1', 'value2', null] } })).toBe(
      "((propertyName IS NOT null AND NOT(propertyName IN('value1','value2'))))"
    );
  });

  test('свойство фильтра с оператором $gt преобразуется в >', () => {
    expect(buildCqlFilter({ propertyName: { $gt: 5 } })).toBe("(propertyName > '5')");
  });

  test('свойство фильтра с оператором $lt преобразуется в <', () => {
    expect(buildCqlFilter({ propertyName: { $lt: 5 } })).toBe("(propertyName < '5')");
  });

  test('свойство фильтра с оператором $gte преобразуется в >=', () => {
    expect(buildCqlFilter({ propertyName: { $gte: 5 } })).toBe("(propertyName >= '5')");
  });

  test('свойство фильтра с оператором $lte преобразуется в <=', () => {
    expect(buildCqlFilter({ propertyName: { $lte: 5 } })).toBe("(propertyName <= '5')");
  });

  test('можно сочетать фильтры по нескольким свойствам', () => {
    expect(
      buildCqlFilter({
        property1: 'value',
        property2: { $lte: 5 },
        property3: { $ilike: '%some%' },
        property4: { $in: ['v1', 'v2', null] },
        property5: { $nin: ['v4', 'v5', null] }
      })
    ).toBe(
      "property1 = 'value' AND (property2 <= '5') AND (property3 ILIKE '%some%') AND ((property4 IN('v1','v2') OR property4 IS null)) AND ((property5 IS NOT null AND NOT(property5 IN('v4','v5'))))"
    );
  });
});
