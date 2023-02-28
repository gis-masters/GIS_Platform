import { Then, When } from '@wdio/cucumber-framework';

import { xTableFilterTypeString } from './XTable-Filter_type_string.block';

When(/^в таблице xtable я очищаю поле фильтра типа string$/, async () => {
  await xTableFilterTypeString.clear();
});

When(/^в таблице xtable я переключаю режим фильтрации в поле фильтра типа string$/, async () => {
  await xTableFilterTypeString.filterClick();
});

When(/^в таблице xtable я ввожу в поле фильтра типа string "(.*)"$/, async (title: string) => {
  await xTableFilterTypeString.setValue(title);
});

Then(/^в таблице xtable кнопка переключения режимов фильтра типа string имеет жёлтую подсветку$/, async () => {
  expect(await xTableFilterTypeString.isFilterActive()).toBeTruthy();
});

Then(/^в таблице xtable кнопка переключения режимов фильтра типа string не имеет жёлтой подсветки$/, async () => {
  expect(await xTableFilterTypeString.isFilterActive()).toBeFalsy();
});

Then(/^в таблице xtable фильтр типа string переходит в нестрогий режим с пустым полем$/, async () => {
  expect(await xTableFilterTypeString.isFilterActive()).toBeFalsy();
  expect(await xTableFilterTypeString.getValue()).toEqual('');
});
