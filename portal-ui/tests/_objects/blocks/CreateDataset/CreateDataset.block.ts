import { Block } from '../../Block';

class CreateDataset extends Block {
  selectors = {
    container: '.CreateDataset'
  };

  async click() {
    const $container = await this.$('container');
    await $container.click();
  }
}

export const createDataset = new CreateDataset();
