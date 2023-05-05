import { DataTable, Then, When } from '@wdio/cucumber-framework';

import { editFeatureBlock } from './EditFeature.block';

Then(
  'в панели атрибутов объекта на карте в списке атрибутов отображается только поле {string}',
  async function (title: string) {
    await editFeatureBlock.checkObjectAttributeFields(title);
  }
);

Then('форма просмотра объекта открывается в режиме {string}', async function (mode: string) {
  const expected = mode === 'чтения';

  await editFeatureBlock.waitForVisible();
  const isReadonly = await editFeatureBlock.isReadonlyMode();

  expect(isReadonly).toEqual(expected);
});

Then('открывается форма просмотра объекта', async function () {
  await editFeatureBlock.waitForVisible();
});

When('в форме просмотра объекта, я перехожу на вкладку просмотра геометрии', async function () {
  await editFeatureBlock.openGeometryTab();
});

Then('вкладка просмотра геометрии в режиме чтения содержит следующую геометрию', async function (data: DataTable) {
  const expectedGeometry = data
    .raw()
    .flat()
    .filter(item => item.length > 2);

  const geometryAsString = await editFeatureBlock.getGeometryInViewMode();
  const geometry = geometryAsString
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .split(' ')
    .filter(item => item.length > 2);

  expect(geometry).toEqual(expectedGeometry);
});

Then(
  'вкладка просмотра геометрии в режиме редактирования содержит следующую геометрию',
  async function (data: DataTable) {
    const expectedGeometry = data
      .raw()
      .flat()
      .filter(item => item.length > 2);

    const geometry = await editFeatureBlock.getGeometryInEditMode();

    expect(geometry).toEqual(expectedGeometry);
  }
);

Then('на форме корректно отображаются {string}', async (variant: string) => {
  await editFeatureBlock.assertSelfie(variant.split(' ').join('-'));
});
