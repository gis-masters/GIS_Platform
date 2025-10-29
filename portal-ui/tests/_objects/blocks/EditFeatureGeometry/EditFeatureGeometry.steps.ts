import { type DataTable, Then, When } from '@wdio/cucumber-framework';

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

When('в вкладке просмотра геометрии я нажимаю кнопку `Координаты контура как текст`', async function () {
  await editFeatureGeometryBlock.clickGeometryAsTextButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Добавить геометрию`', async function () {
  await editFeatureGeometryBlock.clickAddGeometryButton();
});

When(
  'в вкладке просмотра геометрии я перевожу курсор на кнопку `Копировать координаты контура в буфер обмена`',
  async function () {
    await editFeatureGeometryBlock.hoverCopyCoordsButton();
  }
);

When('в вкладке просмотра геометрии я нажимаю кнопку `Удалить линию`', async function () {
  await editFeatureGeometryBlock.clickDeleteGroupButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Удалить полигон`', async function () {
  await editFeatureGeometryBlock.clickDeletePolygonButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Удалить вершину`', async function () {
  await editFeatureGeometryBlock.clickDeleteCoordButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Редактировать геометрию`', async function () {
  await editFeatureGeometryBlock.clickEditOnMap();
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

Then(
  'вкладка просмотра геометрии в режиме редактирования содержит следующую геометрию',
  async function (data: DataTable) {
    const expectedGeometry = data
      .raw()
      .flat()
      .filter(item => !Number.isNaN(Number(item)));

    const geometry = await editFeatureGeometryBlock.getGeometryInEditMode();

    await expect(geometry).toEqual(expectedGeometry);
  }
);
