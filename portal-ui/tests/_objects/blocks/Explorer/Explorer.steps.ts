import { Then, When } from '@wdio/cucumber-framework';

import { explorerBlock } from './Explorer.block';
import { ScenarioScope } from '../../ScenarioScope';

When('в диалоговом окне выбора источника данных я выбираю набор данных', async function (this: ScenarioScope) {
  const { latestDataset } = this;

  await explorerBlock.openExplorerItem(latestDataset.title);
});

When('в диалоговом окне выбора источника данных я выбираю векторную таблицу {string}', async (datatable: string) => {
  await explorerBlock.openExplorerItem(datatable);
});

When('я открываю созданный набор данных', async function (this: ScenarioScope) {
  const { latestDataset } = this;

  await explorerBlock.openExplorerItem(latestDataset.title);
});

When('в наборах данных я выбираю векторную таблицу {string}', async (datatable: string) => {
  await explorerBlock.openExplorerItem(datatable);
});

When('я нажимаю кнопку `Подключить в проект` в панели свойств векторной таблицы', async () => {
  await explorerBlock.addToProject();
});

When('я дожидаюсь окончания загрузки в explorer', async () => {
  await explorerBlock.waitForLoading();
});

When('я выбираю набор данных {string}', async (dataset: string) => {
  await explorerBlock.selectExplorerItem(dataset);
});

When('я выбираю созданный набор данных', async function (this: ScenarioScope) {
  await explorerBlock.selectExplorerItem(this.latestDataset.title);
});

Then('список названий в explorer: {strings}', async (titles: string[]) => {
  await expect(titles).toEqual(await explorerBlock.getListTitles());
});

Then('список в explorer пуст', async () => {
  await explorerBlock.testEmptiness();
});

Then('в списке элементов explorer присутствует {string}', async (itemTitle: string) => {
  await expect(await explorerBlock.getListTitles()).toContain(itemTitle);
});
