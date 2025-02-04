import { describe, expect, test } from '@jest/globals';

import { PageOptions, SortOrder } from '../models';
import { queryObjects } from './queryObjects';

const arr = [
  { id: 10, title: 'мараскин' },
  { id: 11, title: 'каен' },
  { id: 12, title: 'марон' },
  { id: 13, title: 'сливовый' },
  { id: 14, title: 'баклажан' },
  { id: 15, title: 'виноград' },
  { id: 16, title: 'орхидея' },
  { id: 17, title: 'лаванда' },
  { id: 18, title: 'гвоздика' },
  { id: 19, title: 'земляника' },
  { id: 20, title: 'баблгам' },
  { id: 21, title: 'фуксия' },
  { id: 22, title: 'лосось' },
  { id: 23, title: 'мандарин' },
  { id: 24, title: 'мускусная дыня' },
  { id: 25, title: 'банан' },
  { id: 26, title: 'лимон' },
  { id: 27, title: 'медовый' },
  { id: 28, title: 'лайм' },
  { id: 29, title: 'весенний' },
  { id: 30, title: 'клевер' },
  { id: 31, title: 'папоротник' },
  { id: 32, title: 'мох' },
  { id: 33, title: 'флора' },
  { id: 34, title: 'морская пена' },
  { id: 35, title: 'водяная пыль' },
  { id: 36, title: 'небесный' },
  { id: 37, title: 'бирюзовый' }
];

describe('утилита выборки объектов queryObjects', () => {
  test('объекты из массива выбираются согласно номеру и размеру страницы', () => {
    const pageOptions: PageOptions = { page: 1, pageSize: 3 };
    const output = [
      { id: 13, title: 'сливовый' },
      { id: 14, title: 'баклажан' },
      { id: 15, title: 'виноград' }
    ];

    expect(queryObjects(arr, pageOptions)).toStrictEqual(output);
  });

  test('объекты из массива выбираются согласно фильтру и сортировке', () => {
    const pageOptions: PageOptions = {
      page: 0,
      pageSize: 3,
      filter: { title: { $like: '%ро%' } },
      sort: 'title',
      sortOrder: SortOrder.ASC
    };
    const output = [
      { id: 12, title: 'марон' },
      { id: 31, title: 'папоротник' }
    ];

    expect(queryObjects(arr, pageOptions)).toStrictEqual(output);
  });

  test('если размер страницы превышает размер выборки, возвращается то, что нашлось', () => {
    const pageOptions: PageOptions = {
      page: 0,
      pageSize: 300,
      filter: { id: { $gte: 25, $lte: 27 } }
    };
    const output = [
      { id: 25, title: 'банан' },
      { id: 26, title: 'лимон' },
      { id: 27, title: 'медовый' }
    ];

    expect(queryObjects(arr, pageOptions)).toStrictEqual(output);
  });

  test('для последней страницы возвращается оставшееся количество объектов', () => {
    const pageOptions: PageOptions = { page: 5, pageSize: 5 };
    const output = [
      { id: 35, title: 'водяная пыль' },
      { id: 36, title: 'небесный' },
      { id: 37, title: 'бирюзовый' }
    ];

    expect(queryObjects(arr, pageOptions)).toStrictEqual(output);
  });

  test('если номер страницы превышает границы выборки, то возвращается пустой массив', () => {
    const pageOptions: PageOptions = { page: 600, pageSize: 5 };

    expect(queryObjects(arr, pageOptions)).toStrictEqual([]);
  });

  test('если под фильтр не подходит ни один объект, то возвращается пустой массив', () => {
    const pageOptions: PageOptions = { page: 0, pageSize: 3, filter: { title: 'красный' } };

    expect(queryObjects(arr, pageOptions)).toStrictEqual([]);
  });
});
