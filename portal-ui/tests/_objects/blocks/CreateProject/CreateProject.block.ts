import { Block } from '../../Block';

class CreateProjectBlock extends Block {
  selectors = {
    container: '.CreateProject'
  };

  async click() {
    const $container = await this.$('container');
    await $container.waitForDisplayed();
    await $container.click();
  }
}

export const createProjectBlock = new CreateProjectBlock();
