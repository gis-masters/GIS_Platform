import { Then, When } from '@wdio/cucumber-framework';

import { explorerBlock } from './Explorer.block';

When(/^выбираю векторную таблицу `админ деление с представлениями`$/, async () => {
  await explorerBlock.selectedVectorTableWithViews();
});

When(/^я захожу в первый набор данных$/, async () => {
  await explorerBlock.authWithError();
});

When(/^выбираю векторную таблицу `админ деление без представлений`$/, async () => {
  await explorerBlock.selectedVectorTableWithoutViews();
});

When(/^нажимаю кнопку `Подключить в проект` в правой панели векторной таблицы$/, async () => {
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
