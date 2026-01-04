import { Block } from '../../Block';

class FeaturesListBlock extends Block {
  selectors = {
    root: '.FeaturesList',
    item: '.FeaturesList .FeaturesListItem'
  };

  async openFirstItem(): Promise<void> {
    await this.waitForVisible();

    const $$items = await this.findAllBySelector('item');
    const $item = $$items[0];

    if ($item) {
      const $openBtn = await $item.$('.FeaturesListItem-OpenEdit').getElement();

      await $openBtn.waitForClickable();
      await $openBtn.click();
    }
  }

  async openLastItem(): Promise<void> {
    await this.waitForVisible();

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
