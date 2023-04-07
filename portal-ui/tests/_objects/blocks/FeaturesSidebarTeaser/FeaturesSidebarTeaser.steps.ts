import { When, Then } from '@wdio/cucumber-framework';

import { featuresSidebarTeaserBlock } from './FeaturesSidebarTeaser.block';

When('открыта панель выделенных объектов', async function () {
  await featuresSidebarTeaserBlock.open();
});

Then('счётчик выделенных объектов содержит число {int}', async function (expectedValue: number) {
  await browser.waitUntil(async () => {
    const currentValue = await featuresSidebarTeaserBlock.getValue();

    return currentValue === expectedValue;
  });
});
