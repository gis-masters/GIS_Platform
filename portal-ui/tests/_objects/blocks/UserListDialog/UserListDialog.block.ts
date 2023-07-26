import { Block } from '../../Block';

class UserListDialogBlock extends Block {
  selectors = {
    container: '.Users-AddDialog',
    tableContainer: '.Users-AddDialog .XTable-Container'
  };

  async waitForTableContainer(): Promise<void> {
    const $tableContainer = await this.$('tableContainer');

    await $tableContainer.waitForDisplayed({ timeout: 5000 });
  }
}

export const userListDialogBlock = new UserListDialogBlock();
