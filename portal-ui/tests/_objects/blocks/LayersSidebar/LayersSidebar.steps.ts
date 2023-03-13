import { When } from '@wdio/cucumber-framework';

import { layersSidebarBlock } from './LayersSidebar.block';

When(/^в списке слоёв на карте я нажимаю кнопку `Настроить слои проекта`$/, async () => {
  await layersSidebarBlock.clickEditButton();
});

When(/^в списке слоёв на карте я открываю меню первого слоя$/, async () => {
  await layersSidebarBlock.clickLayerBurger();
});

When(/^в списке слоёв на карте я нажимаю `Подключить слой`$/, async () => {
  await layersSidebarBlock.addLayerBtn();
});

When(/^в списке слоёв на карте я открываю `Свойства` слоя$/, async () => {
  await layersSidebarBlock.layerPropertiesOpen();
});

When(/^в списке слоёв на карте я создаю новый объект в слое$/, async () => {
  await layersSidebarBlock.createNewObjectInLayer();
});

When(/^в списке слоёв на карте в открывшемся меню я нажимаю на пункт `Открыть таблицу атрибутов`$/, async () => {
  await layersSidebarBlock.clickLayerAttributeTable();
});

When(/^в списке слоёв на карте я открыл диалог `Добавить слой`$/, async () => {
  await layersSidebarBlock.openAddLayerDialog();
});

When(/^в панели слоёв я нажимаю на иконку глаза рядом с элементом с названием "(.*)"$/, async (layerName: string) => {
  await layersSidebarBlock.clickVisibilityBtn(layerName);
});
