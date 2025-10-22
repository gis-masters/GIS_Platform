import { Block } from '../../Block';
import { CopyFeaturesButtonBlock } from '../CopyFeaturesButton/CopyFeaturesButton.block';

class FeaturesListBlock extends Block {
  selectors = {
    container: '.FeaturesList',
    item: '.FeaturesList .FeaturesListItem'
  };

  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.container);

  async waitForLoading(): Promise<void> {
    const $editFeatureLoader = await this.findBySelector('container');
    await $editFeatureLoader.waitForDisplayed();
  }

  async openFirstItem(): Promise<void> {
    await this.waitForLoading();

    const $$items = await this.findAllBySelector('item');
    const $item = $$items[0];

    if ($item) {
      const $openBtn = await $item.$('.FeaturesListItem-OpenEdit').getElement();

      await $openBtn.waitForClickable();
      await $openBtn.click();
    }
  }

  async openLastItem(): Promise<void> {
    await this.waitForLoading();

    const $$items = await this.findAllBySelector('item');
    const $item = $$items.at(-1);

    if ($item) {
      const $openBtn = await $item.$('.FeaturesListItem-OpenEdit').getElement();

      await $openBtn.waitForClickable();
      await $openBtn.click();
    }
  }
}

export const featuresListBlock = new FeaturesListBlock();
