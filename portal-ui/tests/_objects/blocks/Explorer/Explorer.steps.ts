import { Then, When } from '@wdio/cucumber-framework';

import { explorer } from './Explorer.block';

When(/^выбираю векторную таблицу `админ деление с представлениями`$/, async () => {
  await explorer.selectedVectorTableWithViews();
});

When(/^я захожу в первый набор данных$/, async () => {
  await explorer.authWithError();
});

When(/^выбираю векторную таблицу `админ деление без представлений`$/, async () => {
  await explorer.selectedVectorTableWithoutViews();
});

When(/^нажимаю кнопку `Подключить в проект` в правой панели векторной таблицы$/, async () => {
  await explorer.addToProject();
});

When(/^я дожидаюсь окончания загрузки в explorer$/, async () => {
  await explorer.waitForLoading();
});

Then(/^список названий в explorer: (".+"[ ,]*)+$/, async (dirty: string) => {
  await explorer.testTitles(dirty);
});

Then(/^список в explorer пуст$/, async () => {
  await explorer.testEmptiness();
});

Then(/^в списке элементов explorer присутствует "([^"]*)"$/, async (itemTitle: string) => {
  expect(await explorer.getListTitles()).toContain(itemTitle);
});
