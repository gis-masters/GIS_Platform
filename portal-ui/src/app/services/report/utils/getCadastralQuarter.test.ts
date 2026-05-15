import { describe, expect, test } from '@jest/globals';

import { getCadastralQuarter } from './getCadastralQuarter';

describe('getCadastralQuarter', () => {
  test('возвращает первые три группы при полном номере', () => {
    expect(getCadastralQuarter('71:30:010101:100')).toBe('71:30:010101');
  });

  test('возвращает те же три группы, если номер состоит ровно из трех частей', () => {
    expect(getCadastralQuarter('71:30:010101')).toBe('71:30:010101');
  });

  test('не проверяет части после третьей', () => {
    expect(getCadastralQuarter('71:30:010101:extra')).toBe('71:30:010101');
  });

  test('обрезает пробелы по краям', () => {
    expect(getCadastralQuarter('  71:30:010101:1  ')).toBe('71:30:010101');
  });

  test('две группы — null', () => {
    expect(getCadastralQuarter('71:30')).toBeNull();
  });

  test('одна группа — null', () => {
    expect(getCadastralQuarter('71')).toBeNull();
  });

  test('пустая строка — null', () => {
    expect(getCadastralQuarter('')).toBeNull();
  });

  test('буквы в первой группе — null', () => {
    expect(getCadastralQuarter('7a:30:010101:1')).toBeNull();
  });

  test('пустая средняя группа — null', () => {
    expect(getCadastralQuarter('71::010101:1')).toBeNull();
  });
});
