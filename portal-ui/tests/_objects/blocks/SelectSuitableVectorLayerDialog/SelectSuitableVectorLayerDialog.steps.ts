import { When } from '@wdio/cucumber-framework';

import { selectSuitableVectorLayerDialog } from './SelectSuitableVectorLayerDialog.block';

When('в диалоговом окне выбора слоя нажимаю кнопку `Копировать`', async function () {
  await selectSuitableVectorLayerDialog.clickSubmitButton();
});
