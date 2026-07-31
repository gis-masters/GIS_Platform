import { type DataTable } from '@cucumber/cucumber';
import { Then, When } from '@wdio/cucumber-framework';
import { isEqual } from 'lodash';

import { featuresListSidebarBlock } from './FeaturesListSidebar.block';

When('я закрываю панель выделенных объектов нажимая на крестик', async function () {
  await featuresListSidebarBlock.close();
});

When('в боковой панели выделенных объектов я нажимаю `Открыть` у объекта {string}', async function (itemTitle: string) {
  await featuresListSidebarBlock.waitForVisible();
  await featuresListSidebarBlock.openEdit(itemTitle);
});

When(
  'в боковой панели выделенных объектов я нажимаю `Открыть` у объекта слоя {string}',
  async function (itemLayer: string) {
    await featuresListSidebarBlock.waitForVisible();
    await featuresListSidebarBlock.openEditByLayer(itemLayer);
  }
);

When(
  'в боковой панели выделенных объектов я нажимаю `Перейти к объекту` у объекта {string}',
  async function (itemTitle: string) {
    await featuresListSidebarBlock.waitForVisible();
    await featuresListSidebarBlock.zoomToFeature(itemTitle);

    await browser.pause(300); // анимация перехода к объекту
  }
);

When(
  'в боковой панели выделенных объектов я нажимаю `Перейти к объекту` у объекта слоя {string}',
  async function (itemLayer: string) {
    await featuresListSidebarBlock.waitForVisible();
    await featuresListSidebarBlock.zoomToFeatureByLayer(itemLayer);

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

When('в боковой панели выделенных объектов я открываю первый объект в списке', async function () {
  await featuresListSidebarBlock.openFirstFeature();
});

When('в боковой панели выделенных объектов я навожу курсор на объект {string}', async function (itemTitle: string) {
  await featuresListSidebarBlock.focusToObject(itemTitle);
});

Then('в боковой панели выделенных объектов изменились названия объектов на:', async (expectedNames: DataTable) => {
  const expected = expectedNames.raw()[0];
  let lastNames: string[] = [];

  // Схема/asTitle подгружаются асинхронно — ждём отрисовки названий
  await browser.waitUntil(
    async () => {
      lastNames = await featuresListSidebarBlock.getFeaturesNames();

      return !lastNames.includes('') && isEqual(expected, lastNames);
    },
    {
      timeout: 10_000,
      timeoutMsg: `Ожидались названия [${expected.join(', ')}], получено [${lastNames.join(', ')}]`
    }
  );
});

Then('в боковой панели выделенных объектов отображаются {string}', async (variant: string) => {
  await featuresListSidebarBlock.assertSelfie(variant);
});

Then('в боковой панели выделенных объектов существуют объекты:', async (expectedNames: DataTable) => {
  const rawExpectedNames = expectedNames.raw().slice(1);
  let lastNames: string[][] = [];

  // WFS-прокол и asTitle подгружаются асинхронно — ждём появления ожидаемых объектов
  await browser.waitUntil(
    async () => {
      try {
        lastNames = await Promise.all(
          rawExpectedNames.map(async name => {
            const featuresListItemBlock = await featuresListSidebarBlock.getFeaturesListItemByTitle(name[0]);
            const [, layer, title] = await featuresListItemBlock.getItemData();

            return [title, layer];
          })
        );

        return isEqual(rawExpectedNames, lastNames);
      } catch {
        return false;
      }
    },
    {
      timeout: 10_000,
      timeoutMsg: `Ожидались объекты ${JSON.stringify(rawExpectedNames)}, получено ${JSON.stringify(lastNames)}`
    }
  );
});

Then('панель выделенных объектов закрывается', async function () {
  await featuresListSidebarBlock.waitForHidden();
});

When('панель выделенных объектов отобразилась', async function () {
  await featuresListSidebarBlock.waitForVisible();
});

Then('открывается боковая панель выделенных объектов', async function () {
  await featuresListSidebarBlock.waitForVisible();
});

Then(
  'в боковой панели выделенных объектов у объекта отображается id, название, имя слоя и иконка:',
  async function (itemValues: DataTable) {
    const values = itemValues.raw()[0];
    const [id, layer] = await featuresListSidebarBlock.listItemData(values);

    expect([values[0], values[2]]).toEqual([id, layer]);
  }
);

Then('в списке выделенных объектов отображаются {int} объекта', async (expectedCount: number) => {
  const actualCount = await featuresListSidebarBlock.getFeaturesCount();

  if (actualCount !== expectedCount) {
    throw new Error(`Ожидалось ${expectedCount} объектов в списке выделенных, но найдено ${actualCount}`);
  }
});
