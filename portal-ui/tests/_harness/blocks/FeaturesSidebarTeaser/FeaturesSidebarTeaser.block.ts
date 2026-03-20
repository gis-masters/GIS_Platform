import { Block } from '../../classes/Block';

class FeaturesSidebarTeaserBlock extends Block {
  selectors = {
    root: '.FeaturesSidebarTeaser'
  };

  async open() {
    const $root = await this.findBySelector('root');
    await $root.waitForClickable();
    await $root.click();
  }

  async getValue(): Promise<number> {
    const $root = await this.findBySelector('root');
    const $badge = await $root.$('.MuiBadge-badge').getElement();
    const result = await $badge.getText();

    return Number(result);
  }
}

export const featuresSidebarTeaserBlock = new FeaturesSidebarTeaserBlock();
