import { Block } from '../../classes/Block';

export class PrintActionBlock extends Block {
  selectors = {
    root: '.PrintAction'
  };

  async click(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();
    await $root.click();
  }
}
