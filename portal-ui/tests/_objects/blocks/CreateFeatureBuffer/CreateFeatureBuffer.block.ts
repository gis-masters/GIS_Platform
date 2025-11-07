import { Block } from '../../Block';

class CreateBufferButtonBlock extends Block {
  selectors = {
    root: '.CreateBufferButton'
  };

  async clickCreateBufferBtn(): Promise<void> {
    await this.waitForVisible();

    const $root = await this.findBySelector('root');
    await $root.waitForClickable();
    await $root.click();
  }
}

export const createBufferButtonBlock = new CreateBufferButtonBlock();
