import { Block } from '../../Block';

class ToastStoryButtonBlock extends Block {
  selectors = {
    root: '.ToastStoryButton'
  };

  async emitToast(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.click();
    await browser.pause(500); // анимация появления уведомления (да, она долгая)
  }
}

export const toastStoryButtonBlock = new ToastStoryButtonBlock();
