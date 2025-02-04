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

Then('в форме редактирования геометрии номера координат равны: {strings}', async function (expected: string[]) {
  await expect(await editFeatureGeometryBlock.getEditFormCoordsIndexes()).toEqual(expected);
});

Then('в форме просмотра геометрии номера координат равны: {strings}', async function (expected: string[]) {
  await expect(await editFeatureGeometryBlock.getViewFormCoordsIndexes()).toEqual(expected);
});
