import { binding, given, then, when } from 'cucumber-tsflow/dist';

import { env } from '../../../../src/app/stores/Env.store';
import { Block, BlockModel } from '../../Block';

declare const window: { env: typeof env };

@binding()
class Toast extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Toast');
  }

  get $moar(): Promise<WebdriverIO.Element> {
    return $('.Toast-Moar');
  }

  get $close(): Promise<WebdriverIO.Element> {
    return $('.Toast-Close');
  }

  get $details(): Promise<WebdriverIO.Element> {
    return $('.Toast-Details');
  }

  @when(/^я нажимаю на псевдоссылку Подробнее\/Скрыть в уведомлении$/)
  async clickMoar(): Promise<void> {
    const $moar = await this.$moar;
    await $moar.click();
    await this.mockErrorFile();
  }

  @when(/^я нажимаю на крестик в уведомлении$/)
  async clickClose(): Promise<void> {
    const $close = await this.$close;
    await $close.click();
  }

  @given(/^произошла искусственная ошибка и присутствует уведомление о ней$/)
  async produceError(): Promise<void> {
    await browser.executeAsync(callback => {
      setTimeout(() => {
        window.env.setEnv({
          ...window.env,
          sendErrorsToTG: { http: false, https: false },
          suppressToastErrors: { http: false, https: false }
        });

        callback();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        window.notExistFunction();
      }, 1000);
    });

    await this.waitForVisible();
    await browser.pause(300); // animation
  }

  async mockErrorFile(): Promise<void> {
    await browser.execute(() => {
      const fileNameEl = document.querySelector('.Toast-Source');
      if (fileNameEl) {
        fileNameEl.innerHTML = '/fakeFileName.js';
      }
      const fileNumsEl = document.querySelector('.Toast-FileNums');
      if (fileNumsEl) {
        fileNumsEl.innerHTML = '13:13';
      }
    });
  }

  async waitForVisible(): Promise<void> {
    const $container = await this.$container;

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется уведомление' });
    await browser.pause(300); // animation
  }

  async isVisible(): Promise<boolean> {
    const $container = await this.$container;

    return await $container.isDisplayed();
  }

  @then(/^уведомление исчезает$/)
  async waitForHidden(): Promise<void> {
    const $container = await this.$container;
    await $container.waitForDisplayed({ timeout: 2000, reverse: true, timeoutMsg: 'Не скрывается уведомление' });
    await browser.pause(300); // animation
  }

  @then(/^появляются подробности уведомления$/)
  async waitForDetails(): Promise<void> {
    const $details = await this.$details;
    await $details.waitForDisplayed();
  }

  @then(/^исчезают подробности уведомления$/)
  async waitForDetailsHidden(): Promise<void> {
    const $details = await this.$details;
    await $details.waitForDisplayed({ reverse: true });
  }
}

export const toast = new Toast();
