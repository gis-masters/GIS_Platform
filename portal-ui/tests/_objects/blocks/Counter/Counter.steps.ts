import { Then } from '@wdio/cucumber-framework';

import { counterBlock } from './Counter.block';

Then('в счетчике реестра документов отображается {string}', async (value: string) => {
  const currentCounters = await counterBlock.getCounterValue();

  await expect(currentCounters).toEqual(value);
});

Then('в попапе с детальной информацией счетчика отображается {string}', async (value: string) => {
  await counterBlock.clickShowMoreButton();
  const countersValue = await counterBlock.getCounterItemsValue();

  await expect(countersValue).toEqual(value);
});
