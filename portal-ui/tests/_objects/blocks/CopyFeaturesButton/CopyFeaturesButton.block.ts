import { Block } from '../../Block';

export class CopyFeaturesButtonBlock extends Block {
  selectors = {
    container: '.CopyFeaturesButton'
  };

  async click(): Promise<void> {
    const $container = await this.findBySelector('container');
    await $container.waitForClickable();
    await $container.click();
  }
}
