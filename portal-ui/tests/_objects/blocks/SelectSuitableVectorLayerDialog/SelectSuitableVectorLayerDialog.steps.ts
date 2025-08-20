import { When } from '@wdio/cucumber-framework';

import { selectSuitableVectorLayerDialog } from './SelectSuitableVectorLayerDialog.block';

When('в диалоговом окне выбора слоя нажимаю кнопку `Копировать`', async function () {
  await selectSuitableVectorLayerDialog.clickSubmitButton();
});

When('в диалоговом окне выбора слоя я выбираю слой {string}', async function (layerName: string) {
  await selectSuitableVectorLayerDialog.selectLayer(layerName);
});

When('в диалоговом окне выбора слоя жду завершения копирования объекта', async () => {
  await selectSuitableVectorLayerDialog.waitForLoadingToHide();
});
