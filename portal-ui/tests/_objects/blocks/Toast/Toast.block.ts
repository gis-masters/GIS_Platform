import { Block } from '../../Block';

class ToastBlock extends Block {
  selectors = {
    container: '.Toast',
    moar: '.Toast-Moar',
    close: '.Toast-Close',
    details: '.Toast-Details'
  };

  async clickMoar(): Promise<void> {
    const $moar = await this.$('moar');
    await $moar.click();
  }

  async clickClose(): Promise<void> {
    const $close = await this.$('close');
    await $close.click();
  }

  async produceError(): Promise<void> {
    await browser.executeAsync(callback => {
      setTimeout(() => {
        callback();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        window.notExistFunction();
      }, 1000);
    });

    await this.waitForVisible();
    await browser.pause(300); // анимация появления уведомления
  }

  async waitForVisible(): Promise<void> {
    const $container = await this.$('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется уведомление' });
    await browser.pause(300); // animation
  }

  async notBecomeVisible(): Promise<void> {
    try {
      await this.waitForVisible();
    } catch {
      return;
    }

    throw new Error('Toast не должен был появиться');
  }

  async isVisible(): Promise<boolean> {
    const $container = await this.$('container');

    return await $container.isDisplayed();
  }

  async waitForHidden(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed({ timeout: 2000, reverse: true, timeoutMsg: 'Не скрывается уведомление' });
    await browser.pause(300); // animation
  }

  async waitForDetails(): Promise<void> {
    const $details = await this.$('details');
    await $details.waitForDisplayed();
  }

  async waitForDetailsHidden(): Promise<void> {
    const $details = await this.$('details');
    await $details.waitForDisplayed({ reverse: true });
  }
}

export const toastBlock = new ToastBlock();
