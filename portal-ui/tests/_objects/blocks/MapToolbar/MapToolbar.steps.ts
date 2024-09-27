import { Then, When } from '@wdio/cucumber-framework';

import { mapBlock } from '../Map/Map.block';
import { mapToolbarBlock } from './MapToolbar.block';

Then('в панели инструментов на карте нет кнопки `Снять выделение с объектов`', async () => {
  await expect(await mapToolbarBlock.isCancelSelectionBtnExist()).toEqual(false);
});

When('в панели инструментов на карте я нажимаю на кнопку `Снять выделение с объектов`', async () => {
  await mapToolbarBlock.clickCancelSelectionBtn();
  await mapBlock.moveToMap(); // уводим курсор, чтобы не вылазил тултип
});

When('в панели инструментов на карте я нажимаю на кнопку `Выделение рамкой`', async () => {
  await mapToolbarBlock.clickSelectMultipleBtn();
  await mapBlock.moveToMap(); // уводим курсор, чтобы не вылазил тултип
});

When('в панели инструментов на карте я нажимаю на кнопку `Показать скрыть аннотации`', async () => {
  await mapToolbarBlock.clickTogglerBtn();
  await mapBlock.moveToMap(); // уводим курсор, чтобы не вылазил тултип
});

When('в панели инструментов на карте я нажимаю на кнопку `Подписать поворотные точки`', async () => {
  await mapToolbarBlock.clickTurningPointsBtn();
  await mapBlock.moveToMap(); // уводим курсор, чтобы не вылазил тултип
});

When('в панели инструментов на карте я нажимаю на кнопку `Подписать промеры`', async () => {
  await mapToolbarBlock.clickDistancesBtn();
  await mapBlock.moveToMap(); // уводим курсор, чтобы не вылазил тултип
});
