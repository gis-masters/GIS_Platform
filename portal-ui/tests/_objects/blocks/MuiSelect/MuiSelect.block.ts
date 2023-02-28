import { Block } from '../../Block';

export class MuiSelect extends Block {
  selectors = {
    container: '.MuiInputBase-root div[class*="MuiSelect"]'
  };

  $getSelectOption(i: number): Promise<WebdriverIO.Element> {
    return $(`.MuiMenu-root.MuiModal-root .MuiMenu-list .MuiMenuItem-root:nth-child(${i})`);
  }

  async selectOption(i: number): Promise<void> {
    const $container = await this.$('container');
    await $container.click();

    const option = await this.$getSelectOption(i);
    await option.waitForDisplayed();
    await option.click();

    await option.waitForDisplayed({ reverse: true });
  }

  async getText(): Promise<string> {
    const $container = await this.$('container');
    const $select = await $container.$('.MuiSelect-select');

    return $select.getText();
  }
}
