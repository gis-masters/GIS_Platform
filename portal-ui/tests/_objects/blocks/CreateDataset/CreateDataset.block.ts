import { Block } from '../../Block';

class CreateDatasetBlock extends Block {
  selectors = {
    root: '.CreateDataset'
  };

  async click() {
    const $root = await this.findBySelector('root');
    await $root.click();
  }
}

export const createDatasetBlock = new CreateDatasetBlock();
