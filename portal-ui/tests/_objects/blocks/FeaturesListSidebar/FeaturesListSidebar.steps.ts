import { Then, When } from '@wdio/cucumber-framework';
import { featuresListSidebarBlock } from './FeaturesListSidebar.block';
import { DataTable } from '@cucumber/cucumber';

When('я закрываю панель выделенных объектов нажимая на крестик', async function () {
  await featuresListSidebarBlock.close();
});

When('в боковой панели выделенных объектов я нажимаю `Открыть` у объекта {string}', async function (itemTitle: string) {
  await featuresListSidebarBlock.openEdit(itemTitle);
});

When(
  'в боковой панели выделенных объектов я нажимаю `Перейти к объекту` у объекта {string}',
  async function (itemTitle: string) {
    await featuresListSidebarBlock.zoomToFeature(itemTitle);

    await browser.pause(300); // анимация перехода к объекту
  }
);

When(
  'в боковой панели выделенных объектов я делаю двойной клик по объекту {string}',
  async function (itemTitle: string) {
    await featuresListSidebarBlock.openObject(itemTitle);
  }
);

When('в боковой панели выделенных объектов я делаю клик по объекту {string}', async function (itemTitle: string) {
  await featuresListSidebarBlock.selectObject(itemTitle);
});

Then('в боковой панели выделенных объектов изменились названия объектов на:', async (expectedNames: DataTable) => {
  const currentNames = await featuresListSidebarBlock.getFeaturesNames();

  await expect(expectedNames.raw()[0]).toEqual(currentNames);
});

Then('в боковой панели выделенных объектов существуют объекты:', async (expectedNames: DataTable) => {
  const rawExpectedNames = expectedNames.raw();
  rawExpectedNames.shift();
  const currentNames = await Promise.all(
    rawExpectedNames.map(async name => {
      const featuresListItemBlock = await featuresListSidebarBlock.getFeaturesListItemByTitle(name[0]);
      const [, layer, title] = await featuresListItemBlock.getItemData();

      return [title, layer];
    })
  );

  await expect(rawExpectedNames).toEqual(currentNames);
});

Then('панель выделенных объектов закрывается', async function () {
  await featuresListSidebarBlock.waitForHidden();
});

Then('открывается боковая панель выделенных объектов', async function () {
  await featuresListSidebarBlock.waitForVisible();
});

Then(
  'в боковой панели выделенных объектов у объекта отображается id, название, имя слоя и иконка:',
  async function (itemValues: DataTable) {
    const values = itemValues.raw()[0];
    const [id, layer] = await featuresListSidebarBlock.listItemData(values);

    await expect([values[0], values[2]]).toEqual([id, layer]);
  }
);
