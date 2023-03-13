import { Then, When } from '@wdio/cucumber-framework';

import { layerPropertiesDialogBlock } from './Layer-PropertiesDialog.block';

Then(/^в диалоговом окне `Свойства слоя` у поля `Представление` выбрано "(.*)"$/, async (viewTitle: string) => {
  await layerPropertiesDialogBlock.viewFieldFirstValue(viewTitle);
});

When(/^в диалоговом окне `Свойства слоя` в поле `Представление` выбираю `Представление 2`$/, async () => {
  await layerPropertiesDialogBlock.layerPropertyDialogSelectViewThirdOption();
});

When(/^в диалоговом окне `Свойства слоя` нажимаю `Изменить`$/, async () => {
  await layerPropertiesDialogBlock.saveLayerProperty();
});
