import { When } from '@wdio/cucumber-framework';

import { mapBlock } from './Map.block';

When(/^слой "(.*)" не отображается на карте$/, async (layerName: string) => {
  await mapBlock.layerObjectNotVisibleOnMap(layerName);
});

When(/^слой "(.*)" отображается на карте$/, async (layerName: string) => {
  await mapBlock.layerObjectVisibleOnMap(layerName);
});

When('я протыкаю карту в центре', async function () {
  await mapBlock.clickOnMap();
});
