import { Then, When } from '@wdio/cucumber-framework';

import { getDocumentsLibraryByTitle } from '../../commands/docLibrary/getDocLibraryByTitle';
import { dataManagementPage } from '../../pages/DataManagement.page';
import { ScenarioScope } from '../../ScenarioScope';
import { ExplorerBlock } from './Explorer.block';

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

When('в библиотеке документов я захожу внутрь элемента с названием {string}', async (folder: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.openExplorerItem(folder);
});

When('в библиотеке документов я захожу внутрь созданного документа', async function (this: ScenarioScope) {
  const explorerBlock = new ExplorerBlock();
  if (this.latestLibraryRecords[0]?.title) {
    await explorerBlock.openExplorerItem(this.latestLibraryRecords[0].title);
  }
});

When('в наборах данных я выбираю векторную таблицу {string}', async (datatable: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(datatable);
});

When('в списке элементов explorer я выбираю элемент {string}', async (datatable: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(datatable);
});

When('в списке элементов explorer все элементы недоступны', async () => {
  const explorerBlock = new ExplorerBlock();
  const disabled = await explorerBlock.allItemsIsDisabled();

  await expect(disabled).toEqual(true);
});

When('я нажимаю кнопку `Подключить в проект` в панели свойств векторной таблицы', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.addToProject();
});

When('я дожидаюсь окончания загрузки в explorer', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForLoading();
});

When('в библиотеке документов я выбираю {string}', async (explorerItem: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(explorerItem);
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
