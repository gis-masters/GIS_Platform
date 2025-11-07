import { Block } from '../../Block';

class WorkspaceHeaderMenuBlock extends Block {
  selectors = {
    root: '.WorkspaceHeader-Menu'
  };

  $getMenuItem(itemName: string): Promise<WebdriverIO.Element> {
    return $(`.WorkspaceHeader-MenuItemTitle*=${itemName}`).getElement();
  }

  async selectMainMenuOption(itemName: string): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    const $menuItem = await this.$getMenuItem(itemName);
    await $menuItem.click();
  }
}

export const workspaceHeaderMenuBlock = new WorkspaceHeaderMenuBlock();
