import { Block } from '../../Block';

class CreateBufferButtonBlock extends Block {
  selectors = {
    container: '.CreateBufferButton'
  };

  async clickCreateBufferBtn(): Promise<void> {
    await this.waitForVisible();

    const $container = await this.$('container');
    await $container.waitForClickable();
    await $container.click();
  }
}

export const createBufferButtonBlock = new CreateBufferButtonBlock();
