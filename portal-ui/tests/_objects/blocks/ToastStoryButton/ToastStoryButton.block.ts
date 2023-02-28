import { Block } from '../../Block';

class ToastStoryButton extends Block {
  selectors = {
    container: '.ToastStoryButton'
  };

  async emitToast(): Promise<void> {
    const $container = await this.$('container');
    await $container.click();
    await browser.pause(500); // анимация появления уведомления (да, она долгая)
  }
}

export const toastStoryButton = new ToastStoryButton();
