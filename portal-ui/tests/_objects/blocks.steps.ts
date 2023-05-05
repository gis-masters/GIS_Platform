import { Then, When } from '@wdio/cucumber-framework';

import { blocksRegistry } from './Block';

Then('блок {string} вариант {string} выглядит как положено', async (name: string, variant: string) => {
  await blocksRegistry[name].assertSelfie(variant);
});

When('дожидаюсь появления блока {string}', async (name: string) => {
  await blocksRegistry[name].waitForVisible();
});
