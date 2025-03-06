import { Then } from '@wdio/cucumber-framework';

import { featuresSidebarTeaserBlock } from './FeaturesSidebarTeaser.block';

Then('счётчик выделенных объектов содержит число {int}', async function (expectedValue: number) {
  await browser.waitUntil(async () => {
    const currentValue = await featuresSidebarTeaserBlock.getValue();

    return currentValue === expectedValue;
  });
});
