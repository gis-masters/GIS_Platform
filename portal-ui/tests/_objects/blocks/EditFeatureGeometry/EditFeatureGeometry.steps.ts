import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureGeometryBlock } from './EditFeatureGeometry.block';

When(
  'у координаты с номером {int} в поле `X` устанавливаю значение {float}',
  async function (index: number, value: number) {
    await editFeatureGeometryBlock.changeFormInputValue(index, value);
  }
);

When(
  'у координаты с номером {int} устанавливаю значения X: {float} и Y: {float}',
  async function (index: number, x: number, y: number) {
    await editFeatureGeometryBlock.changeCoordinates(index, x, y);
  }
);

When('в геометрии первого контура я добавляю новый узел', async function () {
  await editFeatureGeometryBlock.addNodeClick();
});

When('в вкладке геометрии я нажимаю кнопку `Исправить`', async function () {
  await editFeatureGeometryBlock.geometryFixBtnClick();
});

When('в форме редактирования геометрии я выбираю первое поле в списке координат', async function () {
  await editFeatureGeometryBlock.selectFirstInput();
});

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
