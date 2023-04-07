import { Block } from '../../Block';

class FeaturesListSidebarBlock extends Block {
  selectors = {
    container: '.FeaturesListSidebar',
    closeIcon: '.FeaturesListSidebar-Close'
  };

  async close() {
    const $closeIcon = await this.$('closeIcon');
    await $closeIcon.waitForClickable();
    await $closeIcon.click();
  }
}

export const featuresListSidebarBlock = new FeaturesListSidebarBlock();
