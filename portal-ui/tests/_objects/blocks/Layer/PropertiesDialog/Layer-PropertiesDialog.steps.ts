import { Then, When } from '@wdio/cucumber-framework';

import { layerPropertiesDialog } from './Layer-PropertiesDialog.block';

Then(/^в диалоговом окне `Свойства слоя` у поля `Представление` выбрано "(.*)"$/, async (viewTitle: string) => {
  await layerPropertiesDialog.viewFieldFirstValue(viewTitle);
});

When(/^в диалоговом окне `Свойства слоя` в поле `Представление` выбираю `Представление 2`$/, async () => {
  await layerPropertiesDialog.layerPropertyDialogSelectViewThirdOption();
});

When(/^в диалоговом окне `Свойства слоя` нажимаю `Изменить`$/, async () => {
  await layerPropertiesDialog.saveLayerProperty();
});
