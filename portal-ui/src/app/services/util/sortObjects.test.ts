import { describe, expect, test } from '@jest/globals';

import { sortObjects } from './sortObjects';

describe('утилита сортировки объектов', () => {
  test('функция sortObjects сортирует объекты', () => {
    const input = [
      { a: 3, b: 'a' },
      { a: 0, b: 'c' },
      { a: 2, b: 'b' },
      { a: 1, b: 'b' }
    ];
    const outputA = [
      { a: 0, b: 'c' },
      { a: 1, b: 'b' },
      { a: 2, b: 'b' },
      { a: 3, b: 'a' }
    ];
    const outputB = [
      { a: 3, b: 'a' },
      { a: 1, b: 'b' },
      { a: 2, b: 'b' },
      { a: 0, b: 'c' }
    ];

    expect(sortObjects(input, 'a', true)).toStrictEqual(outputA);
    expect(sortObjects(input, 'b', true, 'a')).toStrictEqual(outputB);
  });
});
