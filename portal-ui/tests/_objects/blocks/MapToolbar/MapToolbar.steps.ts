import { Then, When } from '@wdio/cucumber-framework';

import { mapToolbarBlock } from './MapToolbar.block';
import { mapBlock } from '../Map/Map.block';

Then('в панели инструментов на карте нет кнопки `Снять выделение с объектов`', async () => {
  await expect(await mapToolbarBlock.isCancelSelectionBtnExist()).toEqual(false);
});

When('в панели инструментов на карте я нажимаю на кнопку `Снять выделение с объектов`', async () => {
  await mapToolbarBlock.clickCancelSelectionBtn();
  await mapBlock.moveToMap(); // уводим курсор, чтобы не вылазил тултип
});
