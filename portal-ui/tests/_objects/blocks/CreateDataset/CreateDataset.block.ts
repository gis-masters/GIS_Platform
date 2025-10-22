import { Block } from '../../Block';

class CreateDatasetBlock extends Block {
  selectors = {
    container: '.CreateDataset'
  };

  async click() {
    const $container = await this.findBySelector('container');
    await $container.click();
  }
}

export const createDatasetBlock = new CreateDatasetBlock();
