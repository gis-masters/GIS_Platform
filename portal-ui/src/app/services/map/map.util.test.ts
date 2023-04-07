import { describe, expect, test } from '@jest/globals';

import { buildFeaturesUrlFragment, getFeaturesUrl } from './map.util';

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
