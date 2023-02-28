import { Block } from '../../Block';

class Loading extends Block {
  selectors = {
    container: '.Loading',
    global: '.Loading_global'
  };

  async waitForGlobalVisible(): Promise<void> {
    const $global = await this.$('global');
    await $global.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появляется глобальный лоадер' });
  }

  async waitForGlobalHidden(): Promise<void> {
    const $global = await this.$('global');
    await $global.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не исчезает глобальный лоадер', reverse: true });
  }
}

export const loading = new Loading();
