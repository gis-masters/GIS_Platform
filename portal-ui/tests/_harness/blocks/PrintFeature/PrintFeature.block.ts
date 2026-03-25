import { Block } from '../../classes/Block';

export class PrintFeatureBlock extends Block {
  selectors = {
    root: '.PrintFeature'
  };

  async click(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForClickable();
    await $root.click();
  }
}
