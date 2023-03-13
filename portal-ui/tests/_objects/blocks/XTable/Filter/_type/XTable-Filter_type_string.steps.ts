import { Then, When } from '@wdio/cucumber-framework';

import { xTableFilterTypeStringBlock } from './XTable-Filter_type_string.block';

When(/^в таблице xtable я очищаю поле фильтра типа string$/, async () => {
  await xTableFilterTypeStringBlock.clear();
});

When(/^в таблице xtable я переключаю режим фильтрации в поле фильтра типа string$/, async () => {
  await xTableFilterTypeStringBlock.filterClick();
});

When(/^в таблице xtable я ввожу в поле фильтра типа string "(.*)"$/, async (title: string) => {
  await xTableFilterTypeStringBlock.setValue(title);
});

Then(/^в таблице xtable кнопка переключения режимов фильтра типа string имеет жёлтую подсветку$/, async () => {
  expect(await xTableFilterTypeStringBlock.isFilterActive()).toBeTruthy();
});

Then(/^в таблице xtable кнопка переключения режимов фильтра типа string не имеет жёлтой подсветки$/, async () => {
  expect(await xTableFilterTypeStringBlock.isFilterActive()).toBeFalsy();
});

Then(/^в таблице xtable фильтр типа string переходит в нестрогий режим с пустым полем$/, async () => {
  expect(await xTableFilterTypeStringBlock.isFilterActive()).toBeFalsy();
  expect(await xTableFilterTypeStringBlock.getValue()).toEqual('');
});
