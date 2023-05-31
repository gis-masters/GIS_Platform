import { Block } from '../../Block';

declare const env: { setEnv(env: Record<string, unknown>): void };

export class FormStoryActions extends Block {
  selectors = {
    container: '.FormStoryActions',
    validateData: '.FormStoryActions-ValidateData',
    setValidData: '.FormStoryActions-SetValidData',
    setErrorData: '.FormStoryActions-SetErrorData',
    setDefaultData: '.FormStoryActions-SetDefaultData',
    clearData: '.FormStoryActions-ClearData'
  };

  async validate(): Promise<void> {
    await this.clickButton('validateData');
  }

  async setValidData(): Promise<void> {
    await this.clickButton('setValidData');
  }

  async setErrorData(): Promise<void> {
    await this.clickButton('setErrorData');
  }

  async setDefaultData(): Promise<void> {
    await this.clickButton('setDefaultData');
  }

  async clear(): Promise<void> {
    await this.clickButton('clearData');
  }

  private async clickButton(key: keyof this['selectors']): Promise<void> {
    const $button = await this.getElement(key);
    await $button.click();
    await this.browser.pause(1200); // animation
  }
}
