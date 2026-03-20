import { When } from '@wdio/cucumber-framework';

import { saveScreenshot } from '../commands/saveScreenshot';

When(/^тестовый скриншот "(.*)"|тестовый скриншот/, async (screenshotName: string) => {
  await saveScreenshot(screenshotName);
});
