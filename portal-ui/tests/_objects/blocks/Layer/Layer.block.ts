import { Block } from '../../Block';
import { hasClass } from '../../utils/hasClass';
import { layersSidebarBlock } from '../LayersSidebar/LayersSidebar.block';

class LayerBlock extends Block {
  selectors = {
    container: '.Layer'
  };

  async getLayerByName(layerName: string): Promise<WebdriverIO.Element | undefined> {
    await layersSidebarBlock.waitForLayersSidebarDisplayed();

    const $$layerCard = await this.$$('container');

    for (const $layerCard of $$layerCard) {
      const layerCardName = await $layerCard.getText();

      if (layerCardName === layerName) {
        return $layerCard;
      }
    }
  }

  async isLayerVisible(title: string): Promise<boolean> {
    const $layerCard = await this.getLayerByName(title);
    if (!$layerCard) {
      throw new Error(`Не найден элемент "${title}"`);
    }

    return hasClass($layerCard, 'LayersTree-Item_visible');
  }
}

export const layerBlock = new LayerBlock();
