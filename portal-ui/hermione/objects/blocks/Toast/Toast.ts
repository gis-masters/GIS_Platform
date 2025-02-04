import { Block } from '../../Block';

declare const env: { setEnv(env: Record<string, unknown>): void };

export class Toast extends Block {
  selectors = {
    container: '.Toast',
    moar: '.Toast-Moar',
    close: '.Toast-Close',
    details: '.Toast-Details',
    fileName: '.Toast-Source',
    fileNums: '.Toast-FileNums'
  };

  async clickMoar(): Promise<void> {
    const $moar = await this.getElement('moar');

    return await $moar.click();
  }

  async clickClose(): Promise<void> {
    const $close = await this.getElement('close');

    return await $close.click();
  }

  produceError(): Promise<void> {
    return this.browser.execute(() => {
      setTimeout(() => {
        env.setEnv({
          ...env,
          sendErrorsToTG: { http: false, https: false },
          suppressToastErrors: { http: false, https: false }
        });

        // @ts-ignore
        window.notExistFunction();
      }, 1000);
    });
  }

  async mockErrorFile(): Promise<void> {
    await this.browser.execute(({ fileName, fileNums }) => {
      const fileNameEl = document.querySelector(fileName);
      if (fileNameEl) {
        fileNameEl.innerHTML = '/fakeFileName.js';
      }
      const fileNumsEl = document.querySelector(fileNums);
      if (fileNumsEl) {
        fileNumsEl.innerHTML = '13:13';
      }
    }, this.selectors);
  }

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется уведомление' });
    await this.browser.pause(1000); // animation
  }

  async isVisible(): Promise<boolean> {
    const $container = await this.getElement('container');

    return await $container.isDisplayed();
  }

  async waitForHidden(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, reverse: true, timeoutMsg: 'Не скрывается уведомление' });
    await this.browser.pause(1000); // animation
  }

  async waitForDetails(): Promise<void> {
    const $details = await this.getElement('details');

    await $details.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляются детали' });
  }

  async waitForDetailsHidden(): Promise<void> {
    const $details = await this.getElement('details');

    await $details.waitForDisplayed({ reverse: true, timeoutMsg: 'Не скрываются детали' });
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }
}
