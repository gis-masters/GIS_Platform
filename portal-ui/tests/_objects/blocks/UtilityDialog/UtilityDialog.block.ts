import { Block } from '../../Block';
import { DialogBlock } from '../Dialog/Dialog.block';

class UtilityDialogBlock extends Block {
  selectors = {
    container: '.UtilityDialog'
  };

  async clickButtonByTitle(title: string): Promise<void> {
    const $container = await this.$('container');
    const dialogBlock = new DialogBlock(null, $container);

    await dialogBlock.clickButtonByTitle(title);
  }
}

export const utilityDialogBlock = new UtilityDialogBlock();
