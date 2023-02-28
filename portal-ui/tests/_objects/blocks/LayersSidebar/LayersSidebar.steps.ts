import { When } from '@wdio/cucumber-framework';

import { layersSidebar } from './LayersSidebar.block';

When(/^в списке слоёв на карте я нажимаю кнопку `Настроить слои проекта`$/, async () => {
  await layersSidebar.clickEditButton();
});

When(/^в списке слоёв на карте я открываю меню первого слоя$/, async () => {
  await layersSidebar.clickLayerBurger();
});

When(/^в списке слоёв на карте я нажимаю `Подключить слой`$/, async () => {
  await layersSidebar.addLayerBtn();
});

When(/^в списке слоёв на карте я открываю `Свойства` слоя$/, async () => {
  await layersSidebar.layerPropertiesOpen();
});

When(/^в списке слоёв на карте я создаю новый объект в слое$/, async () => {
  await layersSidebar.createNewObjectInLayer();
});

When(/^в списке слоёв на карте в открывшемся меню я нажимаю на пункт `Открыть таблицу атрибутов`$/, async () => {
  await layersSidebar.clickLayerAttributeTable();
});

When(/^в списке слоёв на карте я открыл диалог `Добавить слой`$/, async () => {
  await layersSidebar.openAddLayerDialog();
});
