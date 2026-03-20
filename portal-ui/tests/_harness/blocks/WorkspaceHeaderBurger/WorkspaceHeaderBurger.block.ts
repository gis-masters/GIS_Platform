import { Block } from '../../classes/Block';

class WorkspaceHeaderBurgerBlock extends Block {
  selectors = {
    root: '.WorkspaceHeader-Burger'
  };

  async openMainMenu(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await $root.click();
  }
}

export const workspaceHeaderBurgerBlock = new WorkspaceHeaderBurgerBlock();
