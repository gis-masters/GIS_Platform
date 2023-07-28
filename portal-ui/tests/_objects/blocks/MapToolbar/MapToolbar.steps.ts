import { Then } from '@wdio/cucumber-framework';

import { mapToolbarBlock } from './MapToolbar.block';

Then('в панели инструментов на карте нет кнопки `Снять выделение с объектов`', async () => {
  const cancelSelectionBtn = await mapToolbarBlock.isCancelSelectionBtnExist();

  await expect(cancelSelectionBtn).toEqual(false);
});

Then('в панели инструментов на карте я нажимаю на кнопку `Снять выделение с объектов`', async () => {
  await mapToolbarBlock.clickCancelSelectionBtn();
});
