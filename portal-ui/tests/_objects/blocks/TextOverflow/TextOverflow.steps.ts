import { When } from '@wdio/cucumber-framework';

import { textOverflow } from './TextOverflow.block';

When(/^я нажимаю кнопку `Показать всё`$/, async () => {
  await textOverflow.clickShowAllButton();
});

When(/^я нажимаю кнопку `Свернуть`$/, async () => {
  await textOverflow.clickHideTextButton();
});
