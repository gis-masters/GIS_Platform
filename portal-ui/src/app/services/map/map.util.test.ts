import { describe, expect, test } from '@jest/globals';

import { buildFeaturesUrlFragment, getFeaturesUrl, matchesUserLayerIdentity } from './map.util';

describe('map util', () => {
  test('Построение URL к объектам', () => {
    expect(getFeaturesUrl(314, 'datasetName', 'tableName', ['1', '2', '3', '4'])).toEqual(
      'http://localhost/projects/314/map/?features={"datasetName":{"tableName":[1,2,3,4]}}'
    );
  });

  test('Построение фрагмента URL проходит корректно', () => {
    const featuresUrlFragment = {};

    buildFeaturesUrlFragment(featuresUrlFragment, 'datasetName', 'tableName', [1, 2, 3, 4]);

    expect(JSON.stringify(featuresUrlFragment)).toEqual('{"datasetName":{"tableName":[1,2,3,4]}}');
  });

  test('Построение фрагмента URL проходит корректно для нескольких наборов данных и таблиц', () => {
    const featuresUrlFragment = {};

    buildFeaturesUrlFragment(featuresUrlFragment, 'dataset_1', 'table_1', [1, 2]);
    buildFeaturesUrlFragment(featuresUrlFragment, 'dataset_2', 'table_2', [1, 2, 3, 4]);
    buildFeaturesUrlFragment(featuresUrlFragment, 'dataset_3', 'table_3', [1]);

    expect(JSON.stringify(featuresUrlFragment)).toEqual(
      '{"dataset_1":{"table_1":[1,2]},"dataset_2":{"table_2":[1,2,3,4]},"dataset_3":{"table_3":[1]}}'
    );
  });
});

describe('matchesUserLayerIdentity', () => {
  test('пустой id не матчит слой без resourceId', () => {
    expect(matchesUserLayerIdentity({ isUserLayer: true })).toBe(false);
    expect(matchesUserLayerIdentity({ isUserLayer: true }, '')).toBe(false);
    expect(matchesUserLayerIdentity({ isUserLayer: true }, 'roads')).toBe(false);
  });

  test('внутренний слой находится по complexName, а не по table resourceId', () => {
    const crgInfo = { isUserLayer: true, resourceId: 'roads', complexName: 'ws:roads' };

    expect(matchesUserLayerIdentity(crgInfo, 'ws:roads')).toBe(true);
    expect(matchesUserLayerIdentity(crgInfo, 'roads')).toBe(false);
  });

  test('внешний слой находится по resourceId', () => {
    expect(matchesUserLayerIdentity({ isUserLayer: true, resourceId: 'nspd_zu' }, 'nspd_zu')).toBe(true);
    expect(matchesUserLayerIdentity({ isUserLayer: true, resourceId: 'nspd_zu' }, 'other')).toBe(false);
  });

  test('внешний resourceId не совпадает с внутренним слоем той же таблицы', () => {
    const internalLayer = { isUserLayer: true, resourceId: 'roads', complexName: 'ws:roads' };

    expect(matchesUserLayerIdentity(internalLayer, 'roads')).toBe(false);
  });
});
