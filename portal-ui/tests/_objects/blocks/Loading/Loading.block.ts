import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class Loading extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Loading');
  }

  get $global(): Promise<WebdriverIO.Element> {
    return $('.Loading_global');
  }

  async waitForGlobalVisible(): Promise<void> {
    const $global = await this.$global;
    await $global.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появляется глобальный лоадер' });
  }

  @when(/^жду исчезновения блокирующего страницу лоадера$/)
  async waitForGlobalHidden(): Promise<void> {
    const $global = await this.$global;
    await $global.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не исчезает глобальный лоадер', reverse: true });
  }
}

export const loading = new Loading();
