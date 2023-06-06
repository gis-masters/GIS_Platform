import { When } from '@wdio/cucumber-framework';

import { layersSidebarBlock } from './LayersSidebar.block';
import { attributesBlock } from '../Attributes/Attributes.block';

When('в списке слоёв на карте я нажимаю кнопку `Настроить слои проекта`', async () => {
  await layersSidebarBlock.clickEditButton();
});

When('в списке слоёв на карте я нажимаю кнопку `Сохранить для всех пользователей`', async () => {
  await layersSidebarBlock.clickSaveButton();
});

When(
  'в списке слоёв в меню слоя {string} я выбираю пункт {string}',
  async (layerName: string, menuItemTitle: string) => {
    await layersSidebarBlock.selectLayersListElementMenuItem(layerName, menuItemTitle);

    if (menuItemTitle === 'Перейти к слою') {
      await browser.pause(400); // анимация перехода к объектам слоя на карте
    }

    await attributesBlock.waitForLoadingDisappear();
  }
);

When('в панели атрибутов объекта создаю новый объект', async () => {
  await layersSidebarBlock.createNewObjectInLayer();
});

When('в списке слоёв я нажимаю на кнопку `Подключить слой`', async () => {
  await layersSidebarBlock.clickAddLayerBtn();
});

When('жду исчезновения блокирующего список слоёв лоадера', async () => {
  await layersSidebarBlock.waitForLoadingHide();
});

When('я перемещаю слой {string} в группу {string}', async (layerName: string, groupName: string) => {
  await layersSidebarBlock.moveLayerToGroup(layerName, groupName);
});
