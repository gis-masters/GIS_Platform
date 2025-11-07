import { Block } from '../../Block';

class CounterBlock extends Block {
  selectors = {
    root: '.Counter',
    showMoreButton: '.Counter-Icon',
    popoverContent: '.Counter-PopoverContent',
    popoverContentItem: '.Counter-PopoverContentItem'
  };

  async getCounterValue(): Promise<string> {
    const $root = await this.findBySelector('root');

    return await $root.getText();
  }

  async clickShowMoreButton() {
    const $showMoreButton = await this.findBySelector('showMoreButton');
    await $showMoreButton.click();
  }

  async getCounterItemsValue(): Promise<string> {
    const $root = await this.findBySelector('popoverContent');
    await $root.waitForDisplayed();

    const $$counterItems = await this.findAllBySelector('popoverContentItem');

    const allCountersValue = [];
    for (const $counterItem of $$counterItems) {
      const counter = await $counterItem.getText();
      allCountersValue.push(counter);
    }

    return allCountersValue.join(' ');
  }
}

export const counterBlock = new CounterBlock();
