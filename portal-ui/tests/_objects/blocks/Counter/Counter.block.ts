import { Block } from '../../Block';

class CounterBlock extends Block {
  selectors = {
    container: '.Counter',
    showMoreButton: '.Counter-Icon',
    popoverContent: '.Counter-PopoverContent',
    popoverContentItem: '.Counter-PopoverContentItem'
  };

  async getCounterValue(): Promise<string> {
    const $container = await this.$('container');

    return await $container.getText();
  }

  async clickShowMoreButton() {
    const $showMoreButton = await this.$('showMoreButton');
    await $showMoreButton.click();
  }

  async getCounterItemsValue(): Promise<string> {
    const $container = await this.$('popoverContent');
    await $container.waitForDisplayed();

    const $$counterItems = await this.$$('popoverContentItem');

    const allCountersValue = [];
    for (const $counterItem of $$counterItems) {
      const counter = await $counterItem.getText();
      allCountersValue.push(counter);
    }

    return allCountersValue.join(' ');
  }
}

export const counterBlock = new CounterBlock();
