import { Block } from '../../Block';

import { getLayerVisibility } from '../../commands/getLayerVisibility';

class MapBlock extends Block {
  selectors = {
    container: '.map'
  };

  async layerObjectNotVisibleOnMap(layerName: string): Promise<void> {
    const layerVisibility = await getLayerVisibility(layerName);

    expect(layerVisibility).toEqual(false);
  }

  async layerObjectVisibleOnMap(layerName: string): Promise<void> {
    const layerVisibility = await getLayerVisibility(layerName);

    expect(layerVisibility).toEqual(true);
  }
}

export const mapBlock = new MapBlock();
