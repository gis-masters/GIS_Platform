import { Then, When } from '@wdio/cucumber-framework';

import { ExplorerBlock } from './Explorer.block';
import { ScenarioScope } from '../../ScenarioScope';
import { dataManagementPage } from '../../pages/DataManagement.page';
import { getDocumentsLibraryByTitle } from '../../commands/docLibrary/getDocLibraryByTitle';

When('в диалоговом окне выбора источника данных я выбираю набор данных', async function (this: ScenarioScope) {
  const { latestDataset } = this;
  const explorerBlock = new ExplorerBlock();

  await explorerBlock.openExplorerItem(latestDataset.title);
});

When('в диалоговом окне выбора источника данных я выбираю векторную таблицу {string}', async (datatable: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(datatable);
});

When('я открываю созданный набор данных', async function (this: ScenarioScope) {
  const { latestDataset } = this;
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.openExplorerItem(latestDataset.title);
});

When('в созданной библиотеке документов я захожу в папку {string}', async (folder: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.openExplorerItem(folder);
});

When('в наборах данных я выбираю векторную таблицу {string}', async (datatable: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(datatable);
});

When('я нажимаю кнопку `Подключить в проект` в панели свойств векторной таблицы', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.addToProject();
});

When('я дожидаюсь окончания загрузки в explorer', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForLoading();
});

When('я выбираю набор данных {string}', async (dataset: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(dataset);
});

When('я выбираю созданный набор данных', async function (this: ScenarioScope) {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(this.latestDataset.title);
});

Then('список названий в explorer: {strings}', async (titles: string[]) => {
  const explorerBlock = new ExplorerBlock();
  await expect(titles).toEqual(await explorerBlock.getListTitles());
});

Then('список в explorer пуст', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.testEmptiness();
});

Then('в списке элементов explorer присутствует {string}', async (itemTitle: string) => {
  const explorerBlock = new ExplorerBlock();
  await expect(await explorerBlock.getListTitles()).toContain(itemTitle);
});

Then(
  'в библиотеке {string} в папке {string} существует документ {string}',
  async (library: string, folder: string, doc: string) => {
    const lib = await getDocumentsLibraryByTitle(library);
    await dataManagementPage.openLibraryPage(lib.table_name);

    const explorerBlock = new ExplorerBlock();
    await explorerBlock.openExplorerItem(folder);

    await expect(await explorerBlock.getListTitles()).toContain(doc);
  }
);
