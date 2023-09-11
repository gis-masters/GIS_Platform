import { Then, When } from '@wdio/cucumber-framework';

import { xTableFilterTypeStringBlock } from './XTable-Filter_type_string.block';

When('в таблице xTable я очищаю поле фильтра типа string', async () => {
  await xTableFilterTypeStringBlock.clear();
});

When('в таблице xTable я переключаю режим фильтрации в поле фильтра типа string', async () => {
  await xTableFilterTypeStringBlock.strictnessClick();
});

When('в таблице xTable я ввожу в поле фильтра типа string {string}', async (title: string) => {
  await xTableFilterTypeStringBlock.setValue(title);
});

Then('блок xTableFilterTypeString вариант {string} выглядит как положено', async (variant: string) => {
  await xTableFilterTypeStringBlock.assertSelfie(variant);
});

Then('в таблице xTable кнопка переключения режимов фильтра типа string имеет жёлтую подсветку', async () => {
  await expect(await xTableFilterTypeStringBlock.isFilterActive()).toBeTruthy();
});

Then('в таблице xTable кнопка переключения режимов фильтра типа string не имеет жёлтой подсветки', async () => {
  await expect(await xTableFilterTypeStringBlock.isFilterActive()).toBeFalsy();
});

Then('в таблице xTable фильтр типа string переходит в нестрогий режим с пустым полем', async () => {
  await expect(await xTableFilterTypeStringBlock.isFilterActive()).toBeFalsy();
  await expect(await xTableFilterTypeStringBlock.getValue()).toEqual('');
});
