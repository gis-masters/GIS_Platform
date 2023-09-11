import { Then } from '@wdio/cucumber-framework';

import { homePage } from './Home.page';

Then('блок HomePage вариант {string} выглядит как положено', async (variant: string) => {
  await homePage.assertSelfie(variant);
});
