import { Then, When } from '@wdio/cucumber-framework';

import { explorerBlock } from './Explorer.block';

When(/^в диалоговом окне выбора источника данных я выбираю набор данных "(.*)"$/, async (dataset: string) => {
  await explorerBlock.openExplorerItem(dataset);
});

When(/^в диалоговом окне выбора источника данных я выбираю векторную таблицу "(.*)"$/, async (datatable: string) => {
  await explorerBlock.openExplorerItem(datatable);
});

When(/^в наборах данных я выбираю набор данных "(.*)"$/, async (dataset: string) => {
  await explorerBlock.openExplorerItem(dataset);
});

When(/^в наборах данных я выбираю векторную таблицу "(.*)"$/, async (datatable: string) => {
  await explorerBlock.openExplorerItem(datatable);
});

When(/^я нажимаю кнопку `Подключить в проект` в панели свойств векторной таблицы$/, async () => {
  await explorerBlock.addToProject();
});

When(/^я дожидаюсь окончания загрузки в explorer$/, async () => {
  await explorerBlock.waitForLoading();
});

Then(/^список названий в explorer: (".+"[ ,]*)+$/, async (dirty: string) => {
  await explorerBlock.testTitles(dirty);
});

Then(/^список в explorer пуст$/, async () => {
  await explorerBlock.testEmptiness();
});

Then(/^в списке элементов explorer присутствует "([^"]*)"$/, async (itemTitle: string) => {
  expect(await explorerBlock.getListTitles()).toContain(itemTitle);
});
