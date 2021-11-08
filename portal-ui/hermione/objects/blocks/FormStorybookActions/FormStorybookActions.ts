import { Block } from '../../Block';

declare const env: { setEnv(env: Record<string, unknown>): void };

export class FormStorybookActions extends Block {
  selectors = {
    container: '.Form-Actions',
    validateDataButton: '#validateData',
    setValidDataButton: '#setValidData',
    setErrorDataButton: '#setErrorData',
    setDefaultDataButton: '#setDefaultData',
    clearDataButton: '#clearData'
  };

  async validate(): Promise<void> {
    await this.clickButton('validateDataButton');
  }

  async setValidData(): Promise<void> {
    await this.clickButton('setValidDataButton');
  }

  async setErrorData(): Promise<void> {
    await this.clickButton('setErrorDataButton');
  }

  async setDefaultData(): Promise<void> {
    await this.clickButton('setDefaultDataButton');
  }

  async clear(): Promise<void> {
    await this.clickButton('clearDataButton');
  }

  private async clickButton(key: keyof this['selectors']): Promise<void> {
    const $button = await this.getElement(key);
    await $button.click();
    await this.browser.pause(1200); // animation
  }
}
