import { Block } from '../../Block';

class CopyFeatureButtonBlock extends Block {
  selectors = {
    container: '.CopyFeatureButton'
  };

  async click(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForClickable();
    await $container.click();
  }
}

export const copyFeatureButtonBlock = new CopyFeatureButtonBlock();
