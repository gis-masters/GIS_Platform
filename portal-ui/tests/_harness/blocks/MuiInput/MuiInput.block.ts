import { Key } from 'webdriverio';

import { assertString } from '../../../../src/app/utils/assertString';
import { Block } from '../../classes/Block';

export class MuiInputBlock extends Block {
  selectors = {
    root: '.MuiInputBase-root',
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

    return assertString(await $input.getValue(), 'MuiInput.getValue');
  }

  async hasWarningIcon(): Promise<boolean> {
    const $root = await this.findBySelector('root');
    const $warning = await $root.$(this.selectors.icon).getElement();

    return await $warning.isDisplayed();
  }
}
