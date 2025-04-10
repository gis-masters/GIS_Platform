import { DataTable, Then, When } from '@wdio/cucumber-framework';

import { attributesBlock } from '../Attributes/Attributes.block';
import { layersSidebarBlock } from './LayersSidebar.block';

When('в списке слоёв на карте я нажимаю кнопку `Настроить слои проекта`', async () => {
  await layersSidebarBlock.clickEditButton();
});

When('в списке слоёв на карте я нажимаю кнопку `Сохранить для всех пользователей`', async () => {
  await layersSidebarBlock.clickSaveButton();
  await layersSidebarBlock.waitForLoadingHide();
});

When('в списке слоёв на карте я нажимаю кнопку `Отменить изменения`', async () => {
  await layersSidebarBlock.clickCancelButton();
  await layersSidebarBlock.waitForLoadingHide();
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

When('в панели окне координаты контура объекта я ввожу координаты:', async (data: DataTable) => {
  const coord = data.raw();

  await layersSidebarBlock.createNewObjectInLayer(coord);
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

When('я нажимаю кнопку `Фильтрация слоёв`', async () => {
  await layersSidebarBlock.clickFilterButton();
});

Then('в списке слоёв отображается {string}', async (variant: string) => {
  await layersSidebarBlock.assertSelfie(variant.split(' ').join('-'));
});

Then('блок LayersSidebar вариант {string} выглядит как положено', async (variant: string) => {
  await layersSidebarBlock.assertSelfieFull(variant);
});
