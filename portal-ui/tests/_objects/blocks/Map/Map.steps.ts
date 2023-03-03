import { When } from '@wdio/cucumber-framework';

import { map } from './Map.block';

When(/^слой "(.*)" не отображается на карте$/, async (layerName: string) => {
  await map.layerObjectNotVisibleOnMap(layerName);
});

When(/^слой "(.*)" отображается на карте$/, async (layerName: string) => {
  await map.layerObjectVisibleOnMap(layerName);
});
