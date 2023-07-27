import { Block } from '../../../Block';
import { XTableBlock } from '../../XTable/XTable.block';

class UsersAddDialogBlock extends Block {
  selectors = {
    container: '.Users-AddDialog'
  };

  xTable = new XTableBlock(this.selectors.container);

  async waitForVisible(): Promise<void> {
    await super.waitForVisible();
    await browser.pause(300); // анимация появления диалога
  }
}

export const usersAddDialogBlock = new UsersAddDialogBlock();
