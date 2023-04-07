import { Then } from '@wdio/cucumber-framework';

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
