import { Then, When } from '@wdio/cucumber-framework';

import { attributesBlock } from '../Attributes/Attributes.block';
import { editLayerPropertiesDialogBlock } from './EditLayerDialog.block';

When(
  'в диалоговом окне `Свойства слоя` в поле {string} выбираю {string}',
  async (fieldTitle: string, optionTitle: string) => {
    await editLayerPropertiesDialogBlock.selectOption(optionTitle, fieldTitle);
  }
);

When('в диалоговом окне `Свойства слоя` в поле `Координатная система` выбираю {string}', async (crs: string) => {
  await editLayerPropertiesDialogBlock.selectProjection(crs);
});

Then('в диалоговом окне `Свойства слоя` у поля `Представление` выбрано {string}', async (viewTitle: string) => {
  await expect(await editLayerPropertiesDialogBlock.getChoiceValue('Представление')).toBe(viewTitle);
});

When('в диалоговом окне `Свойства слоя` нажимаю `Изменить`', async () => {
  await editLayerPropertiesDialogBlock.saveLayerProperty();

  await attributesBlock.waitForLoadingDisappear();
});

When(
  'в диалоговом окне свойств слоя у формы в поле {string} типа string я ввожу значение {string}',
  async (title: string, value: string) => {
    await editLayerPropertiesDialogBlock.setStringFieldValue(title, value);
  }
);

When('жду исчезновения блокирующего диалоговое окно `Свойства слоя` лоадера', async () => {
  await editLayerPropertiesDialogBlock.waitForLoadingHide();
});

When(
  'в диалоговом окне свойств слоя у формы в поле {string} типа choice я выбираю значение {string}',
  async (title: string, value: string) => {
    await editLayerPropertiesDialogBlock.setChoiceFieldValue(title, value);
  }
);
