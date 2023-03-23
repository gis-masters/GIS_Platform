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

When('в панели слоёв я включаю пункт с названием {string}', async (layerName: string) => {
  await layersSidebarBlock.clickVisibilityBtn(layerName);
});

When('в панели слоёв я разворачиваю пункт с названием {string}', async (layerName: string) => {
  await layersSidebarBlock.clickOpenBtn(layerName);
});

When('в списке слоёв отображается только пункт {string}', async (layerName: string) => {
  const layersCardsText = await layersSidebarBlock.getVisibleLayersCardsText();

  expect(layersCardsText).toEqual(layerName);
});

When('в списке слоёв отображаются пункты {string}', async (layersNames: string) => {
  const names = layersNames.split(',');

  const currentNames = await layersSidebarBlock.getLayersCardsNames();
  expect(names).toEqual(currentNames);
});
