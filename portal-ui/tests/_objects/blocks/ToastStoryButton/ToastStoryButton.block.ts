import { Block } from '../../Block';

class ToastStoryButtonBlock extends Block {
  selectors = {
    container: '.ToastStoryButton'
  };

  async emitToast(): Promise<void> {
    const $container = await this.$('container');
    await $container.click();
    await browser.pause(500); // анимация появления уведомления (да, она долгая)
  }
}

export const toastStoryButtonBlock = new ToastStoryButtonBlock();
