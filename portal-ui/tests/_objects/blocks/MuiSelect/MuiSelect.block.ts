import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
export class MuiSelect extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return this.getContainer();
  }

  private async getContainer(): Promise<WebdriverIO.Element> {
    const $parent = await $(this.parentSelector);

    return $parent.$(function (): HTMLElement {
      return (this as HTMLElement).querySelector('.MuiInputBase-root div[class*="MuiSelect"]');
    });
  }

  $getSecondSelectOption(i: number): Promise<WebdriverIO.Element> {
    return $(`.MuiMenu-root.MuiModal-root .MuiMenu-list .MuiMenuItem-root:nth-child(${i})`);
  }

  async selectOption(i: number): Promise<void> {
    const $container = await this.$container;
    await $container.click();

    const option = await this.$getSecondSelectOption(i);
    await option.waitForDisplayed();
    await option.click();

    await option.waitForDisplayed({ reverse: true });
  }

  async getText(): Promise<string> {
    const $container = await this.$container;
    const $select = await $container.$('.MuiSelect-select');

    return $select.getText();
  }
}
