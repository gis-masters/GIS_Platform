import { When, Then } from '@wdio/cucumber-framework';

import { editLayerPropertiesDialogBlock } from './EditLayerDialog.block';
import { attributesBlock } from '../Attributes/Attributes.block';

Then('в диалоговом окне `Свойства слоя` у поля `Представление` выбрано {string}', async (viewTitle: string) => {
  await editLayerPropertiesDialogBlock.viewFieldFirstValue(viewTitle);
});

When('в диалоговом окне `Свойства слоя` в поле `Представление` выбираю {string}', async (view: string) => {
  await editLayerPropertiesDialogBlock.layerPropertyDialogSelectOptionByTitle(view);
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
