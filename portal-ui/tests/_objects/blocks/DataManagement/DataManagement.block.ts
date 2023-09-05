import { Block } from '../../Block';

export class DataManagementBlock extends Block {
  selectors = {
    container: '.DataManagement',
    explorerList: '.DataManagement .Explorer-List',
    menuItem: '.DataManagement .Explorer-List .Explorer-Item'
  };

  async isMenuItemExist(menuItem: string): Promise<boolean | undefined> {
    await this.waitForVisible();

    const $explorerList = await this.$('explorerList');
    await $explorerList.waitForDisplayed();

    const $$menuRows = await this.$$('menuItem');
    for (const $menuRow of $$menuRows) {
      const menuRowTitle = await $menuRow.getText();

      if (menuRowTitle === menuItem) {
        return true;
      }
    }

    return false;
  }
}

export const dataManagementBlock = new DataManagementBlock();
