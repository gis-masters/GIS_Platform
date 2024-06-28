import { DataTable } from '@cucumber/cucumber';
import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureBlock } from './EditFeature.block';

When('я закрываю панель редактирования объекта нажимая на крестик', async function () {
  await editFeatureBlock.close();
});

Then(
  'в панели атрибутов объекта на карте в списке атрибутов отображается только поле {string}',
  async function (title: string) {
    await editFeatureBlock.checkObjectAttributeFields(title);
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

When('дожидаюсь появления формы редактирования объекта', async function () {
  await editFeatureBlock.waitForVisible();
});

When('в форме просмотра объекта, я перехожу на вкладку просмотра геометрии', async function () {
  await editFeatureBlock.openGeometryTab();
});

When(
  'в форме редактирования объекта я изменяю значение поля {string} на {string}',
  async function (title: string, value: string) {
    await editFeatureBlock.changeEditFormFieldValue(title, value);
  }
);

When('в форме редактирования объекта я нажимаю кнопку `Сохранить`', async function () {
  await editFeatureBlock.clickSaveButton();
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
      .filter(item => item.length > 2);

    const geometry = await editFeatureBlock.getGeometryInEditMode();

    await expect(geometry).toEqual(expectedGeometry);
  }
);

Then('на форме корректно отображаются {string}', async (variant: string) => {
  await editFeatureBlock.assertSelfie(variant.split(' ').join('-'));
});
