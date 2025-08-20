import { DataTable } from '@cucumber/cucumber';
import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureBlock } from './EditFeature.block';

When('я нажимаю на стрелку назад в панели просмотра объекта', async function () {
  await editFeatureBlock.goBack();
});

Then(
  'в панели атрибутов объекта на карте в списке атрибутов отображается только поля: {strings}',
  async function (titles: string[]) {
    await editFeatureBlock.checkObjectAttributeFields(titles);
  }
);

Then('форма просмотра объекта открывается в режиме {string}', async function (mode: string) {
  const expected = mode === 'чтения';

  await editFeatureBlock.waitForEditFeatureForm();
  const isReadonly = await editFeatureBlock.isReadonlyMode();

  await expect(isReadonly).toEqual(expected);
});

Then('открывается форма просмотра объекта', async function () {
  await editFeatureBlock.waitForVisible();
});

Then('не открывается форма просмотра объекта', async function () {
  await editFeatureBlock.waitForHidden();
});

When('в форме просмотра объекта, я перехожу на вкладку просмотра геометрии', async function () {
  await editFeatureBlock.openGeometryTab();
});

When('я дожидаюсь исчезновения индикатора загрузки в форме редактирования объекта', async () => {
  await editFeatureBlock.waitForLoaderEnd();
});

When(
  'в форме редактирования объекта я изменяю значение поля {string} на {string}',
  async function (title: string, value: string) {
    await editFeatureBlock.changeEditFormFieldValue(title, value);
  }
);

When('на панели выделенного объекта я нажимаю `Копировать объект в другой слой`', async function () {
  await editFeatureBlock.copyFeaturesButton.click();
});

When('на панели выделенного объекта я нажимаю `Перейти к объекту`', async function () {
  await editFeatureBlock.zoomToFeature();
});

When('в форме редактирования объекта я нажимаю кнопку `Сохранить`', async function () {
  await editFeatureBlock.clickSaveButton();
});

When('в форме редактирования объекта я закрываю окно подтверждения сохранения', async function () {
  await editFeatureBlock.closeConfirmDialog();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Координаты контура как текст`', async function () {
  await editFeatureBlock.clickGeometryAsTextButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Рисовать на карте`', async function () {
  await editFeatureBlock.clickEditOnMap();
});

When('в вкладке просмотра геометрии я перевожу курсор на кнопку `Сохранить`', async function () {
  await editFeatureBlock.focusSaveButton();
});

Then('в форме редактирования объекта в поле {string} значение {string}', async function (title: string, value: string) {
  await editFeatureBlock.waitForVisible();
  await editFeatureBlock.waitForEditFeatureForm();

  await expect(await editFeatureBlock.checkFormFieldValue(title, value)).toBe(true);
});

Then('вкладка просмотра геометрии в режиме чтения содержит следующую геометрию', async function (data: DataTable) {
  const expectedGeometry = data
    .raw()
    .flat()
    .filter(item => item.length > 2);

  const geometryAsString = await editFeatureBlock.getGeometryInViewMode();
  const geometry = geometryAsString
    .replaceAll('\n', ' ')
    .replaceAll('\t', ' ')
    .split(' ')
    .filter(item => item.length > 2);

  await expect(geometry).toEqual(expectedGeometry);
});

Then(
  'вкладка просмотра геометрии в режиме редактирования содержит следующую геометрию',
  async function (data: DataTable) {
    const expectedGeometry = data
      .raw()
      .flat()
      .filter(item => !Number.isNaN(Number(item)));

    const geometry = await editFeatureBlock.getGeometryInEditMode();

    await expect(geometry).toEqual(expectedGeometry);
  }
);

Then('на форме корректно отображаются {string}', async (variant: string) => {
  await editFeatureBlock.assertSelfie(variant.split(' ').join('-'));
});
