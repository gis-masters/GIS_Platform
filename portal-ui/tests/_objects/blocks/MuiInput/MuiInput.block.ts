import { Key } from 'webdriverio';

import { Block } from '../../Block';

export class MuiInputBlock extends Block {
  selectors = {
    container: '.MuiInputBase-root',
    input: '.MuiInputBase-input',
    icon: '.MuiSvgIcon-colorWarning'
  };

  public async findBySelector(selector: keyof typeof this.selectors): Promise<WebdriverIO.Element> {
    return super.findBySelector(selector);
  }

  async clearValue(): Promise<void> {
    const $input = await this.findBySelector('input');
    await $input.moveTo();
    await $input.click();
    await browser.keys([Key.Ctrl, 'a']);
    await browser.keys([Key.Backspace]);
  }

  async setValue(value: string): Promise<void> {
    const $input = await this.findBySelector('input');
    await $input.waitForClickable({ timeout: 5000 });
    for (const char of value) {
      await $input.addValue(char);
      await browser.pause(100);
    }
  }

  async getValue(): Promise<string> {
    const $input = await this.findBySelector('input');

    return await $input.getValue();
  }

  async hasWarningIcon(): Promise<boolean> {
    const $container = await this.findBySelector('container');
    const $warning = await $container.$(this.selectors.icon).getElement();

    return await $warning.isDisplayed();
  }
}
