import { type DataTable } from '@cucumber/cucumber';
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

Then(
  'в панели редактирования объекта отображается объект с значением {string} в поле {string}',
  async function (value: string, field: string) {
    const fieldValue = await editFeatureBlock.getFormViewFieldValue(field);

    await expect(fieldValue).toEqual(value);
  }
);

Then(
  'в панели редактирования объекта в блоке навигации отображается значение {string}',
  async function (value: string) {
    const fieldValue = await editFeatureBlock.getNavigationValue();

    await expect(fieldValue).toEqual(value);
  }
);

When('в панели редактирования объекта я нажимаю на кнопку `Следующий объект`', async function () {
  await editFeatureBlock.clickNextButton();
});

When('в панели редактирования объекта я нажимаю на кнопку `Предыдущий объект`', async function () {
  await editFeatureBlock.clickPrevButton();
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

When('в вкладке просмотра геометрии я нажимаю кнопку `Добавить геометрию`', async function () {
  await editFeatureBlock.clickAddGeometryButton();
});

When(
  'в вкладке просмотра геометрии я перевожу курсор на кнопку `Копировать координаты контура в буфер обмена`',
  async function () {
    await editFeatureBlock.hoverCopyCoordsButton();
  }
);

When('в вкладке просмотра геометрии я нажимаю кнопку `Удалить линию`', async function () {
  await editFeatureBlock.clickDeleteGroupButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Удалить полигон`', async function () {
  await editFeatureBlock.clickDeletePolygonButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Удалить вершину`', async function () {
  await editFeatureBlock.clickDeleteCoordButton();
});

When('в вкладке просмотра геометрии я нажимаю кнопку `Редактировать геометрию`', async function () {
  await editFeatureBlock.clickEditOnMap();
});

When('в вкладке просмотра геометрии я перевожу курсор на кнопку `Сохранить`', async function () {
  await editFeatureBlock.focusSaveButton();
});

Then('в форме редактирования объекта в поле {string} значение {string}', async function (title: string, value: string) {
  await editFeatureBlock.waitForVisible();
  await editFeatureBlock.waitForEditFeatureForm();

  await expect(await editFeatureBlock.checkFormControlFieldValue(title, value)).toBe(true);
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

Then('в панели редактирования объекта отображается форма с полями в {string}', async (variant: string) => {
  await editFeatureBlock.assertSelfie(variant.split(' ').join('-'));
});
