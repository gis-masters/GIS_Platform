import { Then, When } from '@wdio/cucumber-framework';

import { blocksRegistry } from './Block';

Then(/^блок "([\dA-Za-z]*)" вариант "([\dA-Za-z-]*)" выглядит как положено$/, async (name: string, variant: string) => {
  await blocksRegistry[name].assertSelfie(variant);
});

When(/^дожидаюсь появления блока "([\dA-Za-z]*)"$/, async (name: string) => {
  await blocksRegistry[name].waitForVisible();
});
