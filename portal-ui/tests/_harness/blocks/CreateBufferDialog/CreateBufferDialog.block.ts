import { Block } from '../../classes/Block';
import { DialogBlock } from '../Dialog/Dialog.block';

class CreateBufferDialogBlock extends Block {
  selectors = {
    root: '.CreateBufferDialog'
  };

  async clickCreateBuffer(): Promise<void> {
    const dialogBlock = new DialogBlock(await this.findBySelector('root'));
    await dialogBlock.clickPrimaryActionButton();
    await this.waitForHidden();
  }

  async waitForDialogShow(): Promise<void> {
    await this.waitForVisible();
  }
}

export const createBufferDialogBlock = new CreateBufferDialogBlock();
