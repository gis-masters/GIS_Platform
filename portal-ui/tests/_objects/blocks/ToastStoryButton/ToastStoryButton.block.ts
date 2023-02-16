import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class ToastStoryButton extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.ToastStoryButton');
  }

  @when(/^я нажимаю кнопку, вызывающую уведомление в библиотеке блоков$/)
  async emitToast(): Promise<void> {
    const $container = await this.$container;
    await $container.click();
    await browser.pause(500); // анимация появления уведомления (да, она долгая)
  }
}

export const toastStoryButton = new ToastStoryButton();
