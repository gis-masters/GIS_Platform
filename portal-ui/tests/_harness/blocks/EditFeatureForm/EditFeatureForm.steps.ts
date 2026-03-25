import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureBlock } from '../EditFeature/EditFeature.block';
import { editFeatureFormBlock } from './EditFeatureForm.block';

Then(
  'в панели атрибутов объекта на карте в списке атрибутов отображается только поля: {strings}',
  async function (titles: string[]) {
    await editFeatureBlock.waitForLoading();
    await editFeatureFormBlock.checkObjectAttributeFields(titles);
  }
);

Then('форма просмотра объекта открывается в режиме {string}', async function (mode: string) {
  const expected = mode === 'чтения';

  await editFeatureBlock.waitForVisible();
  await editFeatureBlock.waitForLoading();
  await editFeatureFormBlock.waitForForm();
  const isReadonly = await editFeatureBlock.isReadonlyMode();

  expect(isReadonly).toEqual(expected);
});

Then(
  'в панели редактирования объекта отображается объект с значением {string} в поле {string}',
  async function (value: string, field: string) {
    const fieldValue = await editFeatureFormBlock.getFormViewFieldValue(field);

    expect(fieldValue).toEqual(value);
  }
);

When(
  'в форме редактирования объекта я изменяю значение поля {string} на {string}',
  async function (title: string, value: string) {
    await editFeatureFormBlock.changeEditFormFieldValue(title, value);
  }
);

When(
  'в форме редактирования объекта я дописываю значение {string} в начале поля {string}',
  async function (value: string, title: string) {
    await editFeatureFormBlock.addValueToEditFormFieldValue(value, title);
  }
);

Then('в форме редактирования объекта в поле {string} значение {string}', async function (title: string, value: string) {
  await editFeatureBlock.waitForVisible();
  await editFeatureBlock.waitForLoading();
  await editFeatureFormBlock.waitForForm();

  expect(await editFeatureFormBlock.checkFormControlFieldValue(title, value)).toBe(true);
});
