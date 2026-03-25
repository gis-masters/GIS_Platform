import { When } from '@wdio/cucumber-framework';

import { zoomToFeatureBlock } from './ZoomToFeature.block';

When('на панели выделенного объекта я нажимаю `Перейти к объекту`', async function () {
  await zoomToFeatureBlock.click();
});
