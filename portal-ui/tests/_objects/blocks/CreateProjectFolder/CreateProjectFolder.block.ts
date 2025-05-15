import { Block } from '../../Block';

class CreateProjectFolderBlock extends Block {
  selectors = {
    container: '.CreateProjectFolder'
  };

  async click() {
    const $container = await this.$('container');
    await $container.waitForDisplayed();
    await $container.click();
  }
}

export const createProjectFolderBlock = new CreateProjectFolderBlock();
