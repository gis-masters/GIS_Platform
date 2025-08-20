import { Block } from '../../Block';

class FeaturesSidebarTeaserBlock extends Block {
  selectors = {
    container: '.FeaturesSidebarTeaser'
  };

  async open() {
    const $container = await this.$('container');
    await $container.waitForClickable();
    await $container.click();
  }

  async getValue(): Promise<number> {
    const $container = await this.$('container');
    const $badge = await $container.$('.MuiBadge-badge');
    const result = await $badge.getText();

    return Number(result);
  }
}

export const featuresSidebarTeaserBlock = new FeaturesSidebarTeaserBlock();
