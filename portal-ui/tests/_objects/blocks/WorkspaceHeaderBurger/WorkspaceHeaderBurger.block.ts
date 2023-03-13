import { Block } from '../../Block';

class WorkspaceHeaderBurgerBlock extends Block {
  selectors = {
    container: '.WorkspaceHeader-Burger'
  };

  async openMainMenu(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await $container.click();
  }
}

export const workspaceHeaderBurgerBlock = new WorkspaceHeaderBurgerBlock();
