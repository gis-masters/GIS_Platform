import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureGeometryBlock } from './EditFeatureGeometry.block';

When(
  'у координаты с номером {int} в поле `X` устанавливаю значение {string}',
  async function (index: number, value: string) {
    await editFeatureGeometryBlock.changeFormInputValue(index, value);
  }
);

Then(
  'у координаты с номером {int} появляется предупреждение о превышении границы слоя',
  async function (index: number) {
    const hasWarning = await editFeatureGeometryBlock.hasWarningInInput(index);

    await expect(hasWarning).toBeTruthy();
  }
);
