import { When } from '@wdio/cucumber-framework';

import { selectSuitableLayerDialogBlock } from './SelectSuitableLayerDialog.block';

When('в окне выбора слоя я выбираю слой {string}', async function (layer: string) {
  await selectSuitableLayerDialogBlock.selectLayer(layer);
});

When('в окне создания буфера я нажимаю кнопку `Не выбрано` в поле `Слой`', async function () {
  await selectSuitableLayerDialogBlock.clickOpenSelectLayerDialogBtn();
});

When('в окне выбора слоя я нажимаю кнопку `Выбрать`', async function () {
  await selectSuitableLayerDialogBlock.clickSubmitButton();
});
