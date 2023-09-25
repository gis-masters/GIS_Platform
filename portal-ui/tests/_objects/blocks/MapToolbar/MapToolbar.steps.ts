import { Then } from '@wdio/cucumber-framework';

import { mapToolbarBlock } from './MapToolbar.block';

Then('в панели инструментов на карте нет кнопки `Снять выделение с объектов`', async () => {
  await expect(await mapToolbarBlock.isCancelSelectionBtnExist()).toEqual(false);
});

Then('в панели инструментов на карте я нажимаю на кнопку `Снять выделение с объектов`', async () => {
  await mapToolbarBlock.clickCancelSelectionBtn();
});
