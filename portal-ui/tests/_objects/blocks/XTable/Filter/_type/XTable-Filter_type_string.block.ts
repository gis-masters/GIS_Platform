import { Key } from 'webdriverio';

import { Block } from '../../../../Block';

class XTableFilterTypeString extends Block {
  selectors = {
    container: '.XTable-Filter_type_string',
    filterInput: '.XTable-Filter_type_string input',
    filterInputStrictness: '.XTable-Filter_type_string .XTable-FilterStrictness'
  };

  async clear(): Promise<void> {
    const $filterInput = await this.$('filterInput');
    await $filterInput.moveTo();
    await $filterInput.click();

    do {
      await browser.keys([Key.Backspace]);
    } while (await $filterInput.getValue());
  }

  async filterClick(): Promise<void> {
    const $filterInputStrictness = await this.$('filterInputStrictness');
    await $filterInputStrictness.click();
    await browser.pause(300);
  }

  async setValue(title: string) {
    const $filterInput = await this.$('filterInput');
    await $filterInput.setValue(title);
    await browser.pause(300);
  }

  async getValue(): Promise<string> {
    const $filterInput = await this.$('filterInput');

    return $filterInput.getValue();
  }

  async isFilterActive(): Promise<boolean> {
    const $filterInputStrictness = await this.$('filterInputStrictness');
    const cls = await $filterInputStrictness.getAttribute('class');

    return cls.split(' ').includes('XTable-FilterStrictness_filtered');
  }
}

export const xTableFilterTypeString = new XTableFilterTypeString();
