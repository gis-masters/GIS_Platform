import { describe, expect, test } from '@jest/globals';

import { filterObjects, prepareLike } from './filterObjects';
import { FilterQuery } from './filters.models';

describe('утилита фильтрации объектов', () => {
  test('функция prepareLike заменяет нестандартные операторы $like и $ilike на $regex', () => {
    const input = { property1: { $like: '%myValue%' }, property2: { $ilike: '%ot...Value%' } };
    // eslint-disable-next-line unicorn/better-regex
    const output = { property1: { $regex: /^.*myValue.*$/ }, property2: { $regex: /^.*ot...Value.*$/i } };

    expect(prepareLike(input)).toStrictEqual(output);
  });

  test('функция prepareLike работает также c вложенными в операторы $and операторами $like и $ilike', () => {
    const input: FilterQuery = {
      $and: [{ property1: { $like: '%someValue%' } }, { property2: { $ilike: '%oth..Value%' } }]
    };
    const output = {
      // eslint-disable-next-line unicorn/better-regex
      $and: [{ property1: { $regex: /^.*someValue.*$/ } }, { property2: { $regex: /^.*oth..Value.*$/i } }]
    };

    expect(prepareLike(input)).toStrictEqual(output);
  });

  test('функция prepareLike работает также c вложенными в операторы $or операторами $like и $ilike', () => {
    const input: FilterQuery = {
      $or: [{ property1: { $like: '%someValue%' } }, { property2: { $ilike: '%oth..Value%' } }]
    };
    const output = {
      // eslint-disable-next-line unicorn/better-regex
      $or: [{ property1: { $regex: /^.*someValue.*$/ } }, { property2: { $regex: /^.*oth..Value.*$/i } }]
    };

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

  test('функция filterObjects корректно фильтрует email с тире', () => {
    const emailWithDash = 'niiag-crimia@bk.ru';
    const testEmails = [{ email: emailWithDash }, { email: 'test@example.com' }, { email: 'user-name@domain.org' }];

    const emailWithDashObj = { email: emailWithDash };

    // Тест 1: Поиск по части email с тире
    const filter1 = { email: { $ilike: '%niiag-crimia%' } };
    const output1 = [emailWithDashObj];
    expect(filterObjects(testEmails, filter1)).toStrictEqual(output1);

    // Тест 2: Поиск по полному email с тире
    const filter2 = { email: { $ilike: emailWithDash } };
    const output2 = [emailWithDashObj];
    expect(filterObjects(testEmails, filter2)).toStrictEqual(output2);

    // Тест 3: Поиск по части без тире
    const filter3 = { email: { $ilike: '%test%' } };
    const output3 = [{ email: 'test@example.com' }];
    expect(filterObjects(testEmails, filter3)).toStrictEqual(output3);
  });

  test('фильтрация фамилий с тире, точкой и спецсимволами', () => {
    const testSurnames = [
      { surname: 'Иванов' },
      { surname: 'Петров-Сидоров' },
      { surname: 'Смирнов.' },
      { surname: 'Кузнецова-Иванова' },
      { surname: 'О.Березин' },
      { surname: 'Сергеев/Петров' },
      { surname: 'Сидоров (младший)' }
    ];

    // Поиск по тире
    expect(filterObjects(testSurnames, { surname: { $ilike: '%Петров-Сидоров%' } })).toStrictEqual([
      { surname: 'Петров-Сидоров' }
    ]);
    // Поиск по точке
    expect(filterObjects(testSurnames, { surname: { $ilike: '%Смирнов.%' } })).toStrictEqual([{ surname: 'Смирнов.' }]);
    // Поиск по скобкам
    expect(filterObjects(testSurnames, { surname: { $ilike: '%(младший)%' } })).toStrictEqual([
      { surname: 'Сидоров (младший)' }
    ]);
    // Поиск по слэшу
    expect(filterObjects(testSurnames, { surname: { $ilike: '%Сергеев/Петров%' } })).toStrictEqual([
      { surname: 'Сергеев/Петров' }
    ]);
    // Поиск по инициалу с точкой
    expect(filterObjects(testSurnames, { surname: { $ilike: '%О.Березин%' } })).toStrictEqual([
      { surname: 'О.Березин' }
    ]);
    // Поиск по части фамилии с тире
    expect(filterObjects(testSurnames, { surname: { $ilike: '%Кузнецова-Иванова%' } })).toStrictEqual([
      { surname: 'Кузнецова-Иванова' }
    ]);
  });
});
