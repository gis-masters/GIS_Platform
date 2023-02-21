import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class CreateDataset extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.CreateDataset');
  }

  async click() {
    const $container = await this.$container;
    await $container.click();
  }
}

export const createDataset = new CreateDataset();
