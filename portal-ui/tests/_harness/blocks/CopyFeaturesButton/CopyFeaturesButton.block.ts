import { Block } from '../../classes/Block';

export class CopyFeaturesButtonBlock extends Block {
  selectors = {
    root: '.CopyFeaturesButton'
  };

  async click(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForClickable();
    await $root.click();
  }
}
