import { Given, When, Then } from '@wdio/cucumber-framework';

import { xTableBlock } from '../XTable.block';
import { xTableFilterPanelBlock } from './XTable-FilterPanel.block';

Given('в таблице xTable заданы фильтры по нескольким полям', async () => {
  await xTableBlock.filterStringColumn('Название', 'Шкаф');
  await xTableBlock.filterChoiceColumn('Материал', 'Дерево');
  await xTableBlock.filterDocumentColumn('Документы', 'до');
  await xTableBlock.filterNumerableColumn('Вес', '1', '10');
});

When('в панели фильтров xTable я нажимаю на кнопку `Очистить все фильтры`', async () => {
  await xTableFilterPanelBlock.clickClearAll();
});

Then('в панели фильтров xTable я нажимаю на крестик у фильтра по полю {string}', async (title: string) => {
  await xTableFilterPanelBlock.clearItem(title);
});

Then('панель фильтров xTable не отображается', async () => {
  expect(await xTableFilterPanelBlock.isEmpty()).toBeTruthy();
});

Then('в панели фильтров xTable присутствует кнопка очистки фильтров', async () => {
  expect(await xTableFilterPanelBlock.hasClearAll()).toBeTruthy();
});

Then(
  /^в панели фильтров xTable (присутствует|отсутствует) фильтр по полю "([^"]*)"( со значением "([^"]*)")?$/,
  async (present: string, title: string, value?: string) => {
    expect(await xTableFilterPanelBlock.hasItem(title, value)).toBe(present === 'присутствует');
  }
);
