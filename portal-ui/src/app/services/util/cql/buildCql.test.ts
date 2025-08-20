import { describe, expect, test } from '@jest/globals';

import { buildCql } from './buildCql';

describe('cql builder', () => {
  test('свойство фильтра с простым значением и строкой преобразуется в равенство с кавычками', () => {
    const filter = { propertyName: 'someValue' };
    const cql = "(propertyName = 'someValue')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с простым значением и числом преобразуется в равенство без кавычек', () => {
    const filter = { propertyName: 5 };
    const cql = '(propertyName = 5)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с простым значением и null преобразуется в IS null', () => {
    const filter = { propertyName: null };
    const cql = '(propertyName IS null)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $eq и строкой преобразуется в равенство с кавычками', () => {
    const filter = { propertyName: { $eq: 'someValue' } };
    const cql = "(propertyName = 'someValue')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $eq и числом преобразуется в равенство без кавычек', () => {
    const filter = { propertyName: { $eq: 5 } };
    const cql = '(propertyName = 5)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $eq и null преобразуется в IS null', () => {
    const filter = { propertyName: { $eq: null } };
    const cql = '(propertyName IS null)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $ne и строкой преобразуется в неравенство с кавычками', () => {
    const filter = { propertyName: { $ne: 'someValue' } };
    const cql = "(propertyName <> 'someValue')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $ne и числом преобразуется в неравенство без кавычек', () => {
    const filter = { propertyName: { $ne: 5 } };
    const cql = '(propertyName <> 5)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $ne и null преобразуется в NOT IS null', () => {
    const filter = { propertyName: { $ne: null } };
    const cql = '(NOT (propertyName IS null))';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $like преобразуется в LIKE', () => {
    const filter = { propertyName: { $like: '%someValue%' } };
    const cql = "(propertyName LIKE '%someValue%')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $ilike преобразуется в ILIKE', () => {
    const filter = { propertyName: { $ilike: '%someValue%' } };
    const cql = "(propertyName ILIKE '%someValue%')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $in и строками преобразуется в IN с кавычками', () => {
    const filter = { propertyName: { $in: ['value1', 'value2'] } };
    const cql = "(propertyName IN('value1','value2'))";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $in и числами преобразуется в IN без кавычек', () => {
    const filter = { propertyName: { $in: [5, 6] } };
    const cql = '(propertyName IN(5,6))';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $in, содержащим null, преобразуется в связку IN и IS null через OR', () => {
    const filter = { propertyName: { $in: ['value1', 'value2', null] } };
    const cql = "((propertyName IN('value1','value2') OR (propertyName IS null)))";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $nin и строками преобразуется в NOT ... IN с кавычками', () => {
    const filter = { propertyName: { $nin: ['value1', 'value2'] } };
    const cql = "(NOT (propertyName IN('value1','value2')))";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $nin и числами преобразуется в NOT ... IN без кавычек', () => {
    const filter = { propertyName: { $nin: [5, 6] } };
    const cql = '(NOT (propertyName IN(5,6)))';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $nin, содержащим null преобразуется в связку NOT ... IN и IS NOT null через AND', () => {
    const filter = { propertyName: { $nin: ['value1', 'value2', null] } };
    const cql = "((NOT (propertyName IS null) AND NOT (propertyName IN('value1','value2'))))";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $gt и строкой преобразуется в > с кавычками', () => {
    const filter = { propertyName: { $gt: 'A' } };
    const cql = "(propertyName > 'A')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $gt и числом преобразуется в > без кавычек', () => {
    const filter = { propertyName: { $gt: 5 } };
    const cql = '(propertyName > 5)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $lt и строкой преобразуется в < с кавычками', () => {
    const filter = { propertyName: { $lt: 'A' } };
    const cql = "(propertyName < 'A')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $lt и числом преобразуется в < без кавычек', () => {
    const filter = { propertyName: { $lt: 5 } };
    const cql = '(propertyName < 5)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $gte и строкой преобразуется в >= с кавычками', () => {
    const filter = { propertyName: { $gte: 'A' } };
    const cql = "(propertyName >= 'A')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $gte и числом преобразуется в >= без кавычек', () => {
    const filter = { propertyName: { $gte: 5 } };
    const cql = '(propertyName >= 5)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $lte и строкой преобразуется в <= с кавычками', () => {
    const filter = { propertyName: { $lte: 'A' } };
    const cql = "(propertyName <= 'A')";
    expect(buildCql(filter)).toBe(cql);
  });

  test('свойство фильтра с оператором $lte и числом преобразуется в <= без кавычек', () => {
    const filter = { propertyName: { $lte: 5 } };
    const cql = '(propertyName <= 5)';
    expect(buildCql(filter)).toBe(cql);
  });

  test('можно сочетать фильтры по нескольким свойствам', () => {
    const filter = {
      property1: 'value',
      property2: { $lte: 5 },
      property3: { $lte: 'A' },
      property4: { $ilike: '%some%' },
      property5: { $in: ['v1', 5, null] },
      property6: { $nin: ['v4', 5, null] }
    };
    const cql =
      "(property1 = 'value') AND (property2 <= 5) AND (property3 <= 'A') AND (property4 ILIKE '%some%') AND ((property5 IN('v1',5) OR (property5 IS null))) AND ((NOT (property6 IS null) AND NOT (property6 IN('v4',5))))";
    expect(buildCql(filter)).toBe(cql);
  });
});
