import { When } from '@wdio/cucumber-framework';

import { layersSidebarBlock } from './LayersSidebar.block';

When('в списке слоёв на карте я нажимаю кнопку `Настроить слои проекта`', async () => {
  await layersSidebarBlock.clickEditButton();
});

When(/^в списке слоёв в меню слоя "(.*)" я выбираю пункт "(.*)"$/, async (layerName: string, menuItemTitle: string) => {
  await layersSidebarBlock.selectLayersListElementMenuItem(layerName, menuItemTitle);
});

When('в панели атрибутов объекта создаю новый объект', async () => {
  await layersSidebarBlock.createNewObjectInLayer();
});

When('в списке слоёв я нажимаю на кнопку `Подключить слой`', async () => {
  await layersSidebarBlock.clickAddLayerBtn();
});
