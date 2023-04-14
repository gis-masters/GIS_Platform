import { Key } from 'webdriverio';

import { Block } from '../../Block';

export class MuiInputBlock extends Block {
  selectors = {
    container: '.MuiInputBase-input'
  };

  async clearInputValue(): Promise<void> {
    const $input = await this.$('container');
    await $input.moveTo();
    await $input.click();

    do {
      await browser.keys([Key.Backspace]);
    } while (await $input.getValue());
  }

  async setInputValue(value: string): Promise<void> {
    const $input = await this.$('container');

    await $input.setValue(value);
  }
}
