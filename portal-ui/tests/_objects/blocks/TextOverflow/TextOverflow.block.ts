import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class TextOverflow extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.TextOverflow');
  }

  get $link(): Promise<WebdriverIO.Element> {
    return $('.TextOverflow-PseudoLink');
  }

  @when(/^я нажимаю кнопку `Показать всё`$/)
  async clickShowAllButton(): Promise<void> {
    const $link = await this.$link;
    await $link.click();
  }

  @when(/^я нажимаю кнопку `Свернуть`$/)
  async clickHideTextButton(): Promise<void> {
    const $link = await this.$link;
    await $link.click();
  }
}

export const textOverflow = new TextOverflow();
