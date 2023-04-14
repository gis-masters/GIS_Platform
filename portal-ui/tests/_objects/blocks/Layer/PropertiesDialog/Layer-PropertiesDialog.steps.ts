import { Then, When } from '@wdio/cucumber-framework';

import { layerPropertiesDialogBlock } from './Layer-PropertiesDialog.block';
import { attributesBlock } from '../../Attributes/Attributes.block';

Then(/^в диалоговом окне `Свойства слоя` у поля `Представление` выбрано "(.*)"$/, async (viewTitle: string) => {
  await layerPropertiesDialogBlock.viewFieldFirstValue(viewTitle);
});

When('в диалоговом окне `Свойства слоя` в поле `Представление` выбираю {string}', async (view: string) => {
  await layerPropertiesDialogBlock.layerPropertyDialogSelectOptionByTitle(view);
});

When(/^в диалоговом окне `Свойства слоя` нажимаю `Изменить`$/, async () => {
  await layerPropertiesDialogBlock.saveLayerProperty();

  await attributesBlock.waitForLoadingDisappear();
});
