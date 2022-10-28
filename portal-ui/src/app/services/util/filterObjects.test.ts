import { describe, expect, test } from '@jest/globals';

import { prepareLike, filterObjects } from './filterObjects';

describe('утилита фильтрации объектов', () => {
  test('функция prepareLike заменяет нестандартные операторы $like и $ilike на $regex', () => {
    const input = { property1: { $like: '%someValue%' }, property2: { $ilike: '%oth..Value%' } };
    // eslint-disable-next-line unicorn/better-regex
    const output = { property1: { $regex: /^.*someValue.*$/ }, property2: { $regex: /^.*oth..Value.*$/i } };

    expect(prepareLike(input)).toStrictEqual(output);
  });

  test('функция filterObjects фильтрует объекты mongoDB-подобным фильтром', () => {
    const input = [
      { a: 0, b: 'bba' },
      { a: 1, b: 'bba' },
      { a: 2, b: 'Bba2' },
      { a: 3, b: 'ccc' }
    ];
    const output = [
      { a: 1, b: 'bba' },
      { a: 2, b: 'Bba2' }
    ];
    const filter = { a: { $gte: 1 }, b: { $ilike: 'bb%' } };

    expect(filterObjects(input, filter)).toStrictEqual(output);
  });
});
