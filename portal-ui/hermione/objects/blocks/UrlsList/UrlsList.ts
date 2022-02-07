import { Block } from '../../Block';

declare const env: { setEnv(env: Record<string, unknown>): void };

export class UrlsList extends Block {
  selectors = {
    addUrl: '.Form .Form-Field:first-child .UrlsList-AddUrl',
    formDialog: '.FormDialog',
    pseudoLink: '.Form .Form-Field:last-child .UrlsList .UrlsList-Item:first-child .PseudoLink',
    popupDocumentH1: '.MuiDialog-container h1'
  };

  async addUrl(): Promise<void> {
    await this.click('addUrl');

    const $formDialog = await this.getElement('formDialog');

    await $formDialog.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется форма добавление ссылки' });

    await this.browser.pause(300);
  }

  async openPopup(): Promise<void> {
    await this.click('pseudoLink');

    const $h1 = await this.getElement('popupDocumentH1');

    await $h1.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется регламент в диалоговом окне' });

    await this.browser.pause(300);
  }

  private async click(key: keyof this['selectors']): Promise<void> {
    const $button = await this.getElement(key);
    await $button.click();
  }

  async assertSelfie(state: string): Promise<void> {
    const { formDialog } = this.selectors;

    return await this.browser.assertView('plain', formDialog);
  }
}
