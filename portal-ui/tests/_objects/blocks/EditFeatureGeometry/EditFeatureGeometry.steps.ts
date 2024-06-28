import { When } from '@wdio/cucumber-framework';

import { editFeatureGeometryBlock } from './EditFeatureGeometry.block';

When(
  'у координаты с номером {int} в поле {string} устанавливаю значение {string}',
  async function (index: number, fieldType: 'X' | 'Y', value: string) {
    await editFeatureGeometryBlock.changeFormInputValue(index, fieldType, value);
  }
);
