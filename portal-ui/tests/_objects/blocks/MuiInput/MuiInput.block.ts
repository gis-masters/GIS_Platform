import { Key } from 'webdriverio';

import { Block } from '../../Block';

export class MuiInputBlock extends Block {
  selectors = {
    container: '.MuiInputBase-root',
    input: '.MuiInputBase-input',
    icon: '.MuiSvgIcon-colorWarning'
  };

  async clearValue(): Promise<void> {
    const $input = await this.$('input');
    await $input.moveTo();
    await $input.click();
    await browser.keys([Key.Ctrl, 'a']);
    await browser.keys([Key.Backspace]);
  }

  async setValue(value: string): Promise<void> {
    const $input = await this.$('input');
    await $input.waitForClickable({ timeout: 5000 });
    for (const char of value) {
      await $input.addValue(char);
      await browser.pause(100);
    }
  }

  async getValue(): Promise<string> {
    const $input = await this.$('input');

    return await $input.getValue();
  }

  async hasWarningIcon(): Promise<boolean> {
    const $container = await this.$('container');
    const $warning = await $container.$(this.selectors.icon);

    return await $warning.isDisplayed();
  }
}
