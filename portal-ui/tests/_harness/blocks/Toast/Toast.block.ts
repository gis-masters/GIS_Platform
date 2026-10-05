import { Block } from '../../classes/Block';

class ToastBlock extends Block {
  selectors = {
    root: '.Toast',
    moar: '.Toast-Moar',
    close: '.Toast-Close',
    details: '.Toast-Details',
    title: '.Toast-Title',
    error: '.Toast_type_error'
  };

  async clickMoar(): Promise<void> {
    const $moar = await this.findBySelector('moar');
    await $moar.click();
  }

  async clickClose(): Promise<void> {
    const $close = await this.findBySelector('close');
    await $close.click();
  }

  async produceError(): Promise<void> {
    await browser.execute(() => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          window.notExistFunction();
        }, 1000);
      });
    });

    await this.waitForVisible();
    await browser.pause(300); // анимация появления уведомления
  }

  async waitForVisible(): Promise<void> {
    await super.waitForVisible();
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

  async waitForHidden(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForExist({ timeout: 2000, reverse: true, timeoutMsg: 'Не скрывается уведомление' });
    await browser.pause(300); // animation
  }

  async waitForDetails(): Promise<void> {
    const $details = await this.findBySelector('details');
    await $details.waitForDisplayed();
  }

  async waitForDetailsHidden(): Promise<void> {
    const $details = await this.findBySelector('details');
    await $details.waitForExist({ reverse: true });
  }

  async getTitle(): Promise<string> {
    const $title = await this.findBySelector('title');

    return await $title.getText();
  }

  async assertToastWithTitle(msg: string): Promise<void> {
    const msgNorm = normalizeToastText(msg);

    await browser.waitUntil(
      async () => {
        const titles = await this.getTitleTexts();

        return titles.includes(msgNorm);
      },
      {
        timeoutMsg: `Не появилось уведомление "${msg}"`
      }
    );
  }

  async assertDetailsContain(fragment: string): Promise<void> {
    const $details = await this.findBySelector('details');
    await $details.waitForDisplayed();
    const text = normalizeToastText(await $details.getText());

    expect(text).toContain(fragment);
  }

  async assertNoErrorToast(timeout = 1000): Promise<void> {
    let errorSeen = false;

    try {
      await browser.waitUntil(
        async () => {
          const $$errors = await this.findAllBySelector('error');
          errorSeen = $$errors.length > 0;

          return errorSeen;
        },
        { timeout }
      );
    } catch {
      // окно истекло, тост ошибки не появился
    }

    if (errorSeen) {
      throw new Error('Появилось уведомление об ошибке');
    }
  }

  private async getTitleTexts(): Promise<string[]> {
    const $$titles = await this.findAllBySelector('title');
    const texts: string[] = [];

    for (const $title of $$titles) {
      texts.push(normalizeToastText(await $title.getText()));
    }

    return texts;
  }

  /**
   * Убеждаемся, что за короткое окно не появился тост с данным заголовком
   */
  async assertNoToastWithTitle(msg: string): Promise<void> {
    const msgNorm = msg.replaceAll(/\s+/g, ' ').trim();
    let forbiddenSeen = false;
    try {
      await browser.waitUntil(
        async () => {
          const $$titles = await this.findAllBySelector('title');
          for (const $title of $$titles) {
            const raw = await $title.getText();
            const text = raw.replaceAll(/\s+/g, ' ').trim();
            if (text === msgNorm) {
              forbiddenSeen = true;

              return true;
            }
          }

          return false;
        },
        { timeout: 1000 }
      );
    } catch {
      if (forbiddenSeen) {
        throw new Error(`Не ожидали уведомление "${msg}", но оно отобразилось`);
      }

      return;
    }

    if (forbiddenSeen) {
      throw new Error(`Не ожидали уведомление "${msg}", но оно отобразилось`);
    }
  }
}

function normalizeToastText(text: string): string {
  return text.replaceAll(/\s+/g, ' ').trim();
}

export const toastBlock = new ToastBlock();
