import { When } from '@wdio/cucumber-framework';

import { textOverflowBlock } from './TextOverflow.block';

When(/^я нажимаю кнопку `Показать всё`$/, async () => {
  await textOverflowBlock.clickShowAllButton();
});

When(/^я нажимаю кнопку `Свернуть`$/, async () => {
  await textOverflowBlock.clickHideTextButton();
});
