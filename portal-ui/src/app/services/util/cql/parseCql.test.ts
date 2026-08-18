import { describe, expect, test } from '@jest/globals';

import { parseCql } from './parseCql';

describe('cql parser', () => {
  test('cql с равенством и строкой преобразуется в свойство фильтра с простым строковым значением', () => {
    const cql = "propertyName = 'someValue'";
    const filter = { propertyName: 'someValue' };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с равенством и числом преобразуется в свойство фильтра с простым числовым значением', () => {
    const cql = 'propertyName = 5';
    const filter = { propertyName: 5 };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с равенством и true преобразуется в свойство фильтра с boolean true', () => {
    expect(parseCql('propertyName = true')).toStrictEqual({ propertyName: true });
  });

  test('cql с равенством и false преобразуется в свойство фильтра с boolean false', () => {
    expect(parseCql('propertyName = false')).toStrictEqual({ propertyName: false });
  });

  test('cql с равенством TRUE в верхнем регистре преобразуется в boolean true', () => {
    expect(parseCql('propertyName = TRUE')).toStrictEqual({ propertyName: true });
  });

  test('cql с равенством FALSE в верхнем регистре преобразуется в boolean false', () => {
    expect(parseCql('propertyName = FALSE')).toStrictEqual({ propertyName: false });
  });

  test('cql с равенством и именем поля trueFlag не откусывает префикс true', () => {
    expect(parseCql('(trueFlag = 1)')).toStrictEqual({ trueFlag: 1 });
  });

  test('cql с AND и именем поля trueFlag не откусывает префикс true', () => {
    expect(parseCql('a = 1 AND trueFlag = 2')).toStrictEqual({ $and: [{ a: 1 }, { trueFlag: 2 }] });
  });

  test('cql с равенством и именем поля false_positive не откусывает префикс false', () => {
    expect(parseCql('(false_positive = 1)')).toStrictEqual({ false_positive: 1 });
  });

  test('cql с AND и именем поля false_positive не откусывает префикс false', () => {
    expect(parseCql('a = 1 AND false_positive = 2')).toStrictEqual({ $and: [{ a: 1 }, { false_positive: 2 }] });
  });

  test('cql с IN и false преобразуется в равенство с boolean false', () => {
    expect(parseCql('propertyName IN(false)')).toStrictEqual({ propertyName: false });
  });

  test('cql с IN true и false преобразуется в $or равенств с boolean', () => {
    expect(parseCql('propertyName IN(true, false)')).toStrictEqual({
      $or: [{ propertyName: false }, { propertyName: true }]
    });
  });

  test('cql с IN, содержащим null, разбирается как OR равенства и IS null', () => {
    expect(parseCql("(propertyName IN('value1','value2') OR (propertyName IS null))")).toStrictEqual({
      $or: [{ $or: [{ propertyName: 'value2' }, { propertyName: 'value1' }] }, { propertyName: null }]
    });
  });

  test('cql с IN false и IS null через OR преобразуется в $or равенства и IS null', () => {
    expect(parseCql('(flag IN(false) OR (flag IS null))')).toStrictEqual({
      $or: [{ flag: false }, { flag: null }]
    });
  });

  test('cql с неравенством и строкой преобразуется в свойство фильтра с оператором $ne со строковым значением', () => {
    const cql = "(propertyName <> 'someValue')";
    const filter = { propertyName: { $ne: 'someValue' } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с неравенством и числом преобразуется в свойство фильтра с оператором $ne с числовым значением', () => {
    const cql = '(propertyName <> 5)';
    const filter = { propertyName: { $ne: 5 } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с LIKE преобразуется в свойство фильтра с оператором $like', () => {
    const cql = "(propertyName LIKE '%someValue%')";
    expect(parseCql(cql)).toStrictEqual({ propertyName: { $like: '%someValue%' } });
  });

  test('cql с ILIKE преобразуется в свойство фильтра с оператором $ilike', () => {
    const cql = "(propertyName ILIKE '%someValue%')";
    expect(parseCql(cql)).toStrictEqual({ propertyName: { $ilike: '%someValue%' } });
  });

  test('cql с IN преобразуется в свойство фильтра с оператором $or и набором равенств', () => {
    const cql = "(propertyName IN('value1',5))";
    const filter = { $or: [{ propertyName: 5 }, { propertyName: 'value1' }] };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с NOT преобразуется в свойство фильтра с оператором $not', () => {
    const cql = "NOT (propertyName IN('value1',5))";
    const filter = { $not: { $or: [{ propertyName: 5 }, { propertyName: 'value1' }] } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с > и строкой преобразуется в свойство фильтра с оператором $gt со строковым значением', () => {
    const cql = "propertyName > 'A'";
    const filter = { propertyName: { $gt: 'A' } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с > и числом преобразуется в свойство фильтра с оператором $gt с числовым значением', () => {
    const cql = 'propertyName > 5';
    const filter = { propertyName: { $gt: 5 } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с < и строкой преобразуется в свойство фильтра с оператором $lt со строковым значением', () => {
    const cql = "propertyName < 'A'";
    const filter = { propertyName: { $lt: 'A' } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с < и числом преобразуется в свойство фильтра с оператором $lt с числовым значением', () => {
    const cql = 'propertyName < 5';
    const filter = { propertyName: { $lt: 5 } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с >= и строкой преобразуется в свойство фильтра с оператором $gte со строковым значением', () => {
    const cql = "(propertyName >= 'A')";
    const filter = { propertyName: { $gte: 'A' } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с >= и числом преобразуется в свойство фильтра с оператором $gte с числовым значением', () => {
    const cql = '(propertyName >= 5)';
    const filter = { propertyName: { $gte: 5 } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с <= и строкой преобразуется в свойство фильтра с оператором $lte со строковым значением', () => {
    const cql = "(propertyName <= 'A')";
    const filter = { propertyName: { $lte: 'A' } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('cql с <= и числом преобразуется в свойство фильтра с оператором $lte с числовым значением', () => {
    const cql = '(propertyName <= 5)';
    const filter = { propertyName: { $lte: 5 } };
    expect(parseCql(cql)).toStrictEqual(filter);
  });

  test('можно сочетать фильтры по нескольким свойствам', function () {
    const cql =
      "(property1 = 'value')" +
      ' AND (property2 <= 5)' +
      " AND (property3 <= 'A')" +
      " AND (property4 ILIKE '%some%')" +
      " AND (property5 IN('v1',5))";
    const filter = {
      $and: [
        {
          $and: [
            { $and: [{ $and: [{ property1: 'value' }, { property2: { $lte: 5 } }] }, { property3: { $lte: 'A' } }] },
            { property4: { $ilike: '%some%' } }
          ]
        },
        { $or: [{ property5: 5 }, { property5: 'v1' }] }
      ]
    };
    expect(parseCql(cql)).toStrictEqual(filter);
  });
});
