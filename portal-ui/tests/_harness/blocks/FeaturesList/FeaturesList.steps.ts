import { When } from '@wdio/cucumber-framework';

import { featuresListBlock } from './FeaturesList.block';

When('на панели выделенных объектов я перехожу внутрь первого из них', async function () {
  await featuresListBlock.openFirstItem();
});

When('на панели выделенных объектов я перехожу внутрь последнего из них', async function () {
  await featuresListBlock.openLastItem();
});
