import { Then } from '@wdio/cucumber-framework';

import { layerBlock } from './Layer.block';

Then('в панели слоёв включен пункт {string}', async (itemName: string) => {
  const layerVisible = await layerBlock.isLayerVisible(itemName);

  await expect(layerVisible).toEqual(true);
});
