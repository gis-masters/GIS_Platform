import { Block } from '../../Block';

import { getLayerVisibility } from '../../commands/getLayerVisibility';

class MapBlock extends Block {
  selectors = {
    container: '.map',
    map: '.map__map'
  };

  async layerObjectNotVisibleOnMap(layerName: string): Promise<void> {
    const layerVisibility = await getLayerVisibility(layerName);

    await expect(layerVisibility).toEqual(false);
  }

  async layerObjectVisibleOnMap(layerName: string): Promise<void> {
    const layerVisibility = await getLayerVisibility(layerName);

    await expect(layerVisibility).toEqual(true);
  }

  async clickOnMap(): Promise<void> {
    const $map = await this.$('map');
    await $map.waitForClickable();
    await $map.click();
  }
}

export const mapBlock = new MapBlock();
