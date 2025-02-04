import { Block } from '../../../Block';
import { layersSidebarBlock } from '../../LayersSidebar/LayersSidebar.block';

class LayerCardBlock extends Block {
  selectors = {
    container: '.Layer-Card'
  };

  async getLayerCardByName(layerName: string): Promise<WebdriverIO.Element | undefined> {
    await layersSidebarBlock.waitForLayersSidebarDisplayed();

    const $$layerCard = await this.$$('container');

    for (const $layerCard of $$layerCard) {
      const layerCardName = await $layerCard.getText();

      if (layerCardName === layerName) {
        return $layerCard;
      }
    }
  }

  async getLayersCardsNames(): Promise<string[]> {
    await layersSidebarBlock.waitForLayersSidebarDisplayed();

    const $$layerCard = await this.$$('container');
    const names: string[] = [];

    for (const $layerCard of $$layerCard) {
      const name = await $layerCard.getText();
      names.push(name);
    }

    return names;
  }

  async moveToLayerCard(title: string): Promise<void> {
    const $layerCard = await this.getLayerCardByName(title);
    if (!$layerCard) {
      throw new Error(`Не найден элемент "${title}"`);
    }

    await $layerCard.waitForDisplayed({ timeout: 9000 });
    await $layerCard.moveTo();
  }

  async isLayerCardExist(title: string): Promise<boolean> {
    const $layerCard = await this.getLayerCardByName(title);

    return !!$layerCard;
  }

  async isLayerCardErrorIconExist(layerName: string): Promise<boolean> {
    const $layerCard = await this.getLayerCardByName(layerName);
    if (!$layerCard) {
      throw new Error(`Не найден элемент "${layerName}"`);
    }

    const errorIcon = await $layerCard.$('.LayerIcon_type_error');

    return errorIcon.isExisting();
  }

  async clickVisibilityBtn(layerName: string): Promise<void> {
    await this.clickLayerCardBtn(layerName, '.Layer-Eye');
  }

  async clickOpenBtn(layerName: string): Promise<void> {
    await this.clickLayerCardBtn(layerName, '.Layer-Open');
  }

  async clickLayerCardBtn(layerName: string, btnSelectorName: string): Promise<void> {
    await layersSidebarBlock.waitForLayersSidebarDisplayed();

    const $layerCard = await this.getLayerCardByName(layerName);

    if (!$layerCard) {
      throw new Error(`Не найден элемент "${layerName}"`);
    }

    await $layerCard.waitForDisplayed();
    await $layerCard.moveTo();

    const $btn = await $layerCard.$(btnSelectorName);
    await $btn.waitForDisplayed();
    await browser.pause(200); // обязательна иначе нет клика
    await $btn.click();
  }
}

export const layerCardBlock = new LayerCardBlock();
