import { Block } from '../../Block';

class WorkspaceHeaderMenuBlock extends Block {
  selectors = {
    container: '.WorkspaceHeader-Menu'
  };

  $getMenuItem(itemName: string): Promise<WebdriverIO.Element> {
    return $(`.WorkspaceHeader-MenuItemTitle*=${itemName}`);
  }

  async selectMainMenuOption(itemName: string): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $menuItem = await this.$getMenuItem(itemName);
    await $menuItem.click();
  }
}

export const workspaceHeaderMenuBlock = new WorkspaceHeaderMenuBlock();
