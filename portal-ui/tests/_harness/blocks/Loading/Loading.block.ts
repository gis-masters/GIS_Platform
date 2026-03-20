import { Block } from '../../classes/Block';

class LoadingBlock extends Block {
  selectors = {
    root: '.Loading',
    global: '.Loading_global'
  };

  async waitForGlobalVisible(): Promise<void> {
    const $global = await this.findBySelector('global');
    await $global.waitForDisplayed({ timeoutMsg: 'Не появляется глобальный лоадер' });
  }

  async waitForGlobalHidden(): Promise<void> {
    const $global = await this.findBySelector('global');
    await $global.waitForExist({ timeoutMsg: 'Не исчезает глобальный лоадер', reverse: true });
  }
}

export const loadingBlock = new LoadingBlock();
