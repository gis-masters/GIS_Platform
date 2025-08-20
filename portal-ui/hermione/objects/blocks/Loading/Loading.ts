import { Block } from '../../Block';

export class Loading extends Block {
  selectors = {
    container: '.Loading',
    global: '.Loading_global'
  };

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется лоадер' });
  }

  async waitForHidden(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не исчезает лоадер', reverse: true });
  }

  async waitForGlobalVisible(): Promise<void> {
    const $global = await this.getElement('global');

    await $global.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется глобальный лоадер' });
  }

  async waitForGlobalHidden(): Promise<void> {
    const $global = await this.getElement('global');

    await $global.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не исчезает глобальный лоадер', reverse: true });
  }
}
