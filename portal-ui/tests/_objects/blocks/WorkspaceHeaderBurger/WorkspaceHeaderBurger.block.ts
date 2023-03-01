import { Block } from '../../Block';

class WorkspaceHeaderBurger extends Block {
  selectors = {
    container: '.WorkspaceHeader-Burger'
  };

  async openMainMenu(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await $container.click();
  }
}

export const workspaceHeaderBurger = new WorkspaceHeaderBurger();
