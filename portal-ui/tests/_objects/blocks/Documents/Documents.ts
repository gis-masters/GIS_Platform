import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class Documents extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Documents');
  }

  get $add(): Promise<WebdriverIO.Element> {
    return $('.Documents-Add .MuiButton-root');
  }

  @when(/^я нажимаю на кнопку добавления документа в поле типа `document`$/)
  async clickAdd() {
    const $add = await this.$add;
    await $add.click();
  }
}

export const documents = new Documents();
