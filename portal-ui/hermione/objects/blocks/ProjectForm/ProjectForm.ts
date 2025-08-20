import { Block } from '../../Block';

declare const env: { setEnv(env: Record<string, unknown>): void };

export class ProjectForm extends Block {
  selectors = {
    container: '.ProjectForm',
    input: '.ProjectForm-Input input',
    submit: '.ProjectForm-Button_action_submit',
    cancel: '.ProjectForm-Button_action_cancel',
    error: '.ProjectForm-Error'
  };

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется форма создания проекта' });
    await this.browser.pause(400);
  }

  async waitForHidden(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({
      reverse: true,
      timeout: 2000,
      timeoutMsg: 'Не скрывается форма создания проекта'
    });
    await this.browser.pause(400);
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }

  async getInputValue(): Promise<string> {
    const $input = await this.getElement('input');
    return await $input.getValue();
  }

  async setInputValue(title: string): Promise<void> {
    const $input = await this.getElement('input');
    await $input.setValue(title);
  }

  async isInputFocused(): Promise<boolean> {
    const $input = await this.getElement('input');
    return await $input.isFocused();
  }

  async getErrors(): Promise<WebdriverIO.Element[]> {
    return await this.getElements('error');
  }

  async submit(): Promise<void> {
    const $submit = await this.getElement('submit');
    await $submit.click();
    await this.browser.pause(500);
  }

  async cancel(): Promise<void> {
    const $cancel = await this.getElement('cancel');
    await $cancel.click();
    await this.waitForHidden();
  }
}
