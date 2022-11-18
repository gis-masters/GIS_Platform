import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class ProjectForm extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.ProjectForm');
  }

  get $input(): Promise<WebdriverIO.Element> {
    return $('.ProjectForm-Input input');
  }

  get $submit(): Promise<WebdriverIO.Element> {
    return $('.ProjectForm-Button_action_submit');
  }

  get $cancel(): Promise<WebdriverIO.Element> {
    return $('.ProjectForm-Button_action_cancel');
  }

  get $error(): Promise<WebdriverIO.Element> {
    return $('.ProjectForm-Error');
  }

  async getInputValue(): Promise<string> {
    const $input = await this.$input;

    return await $input.getValue();
  }

  @when(/^ввожу в поле ввода названия проекта "(.*)"$/)
  async setInputValue(title: string): Promise<void> {
    const $input = await this.$input;
    await $input.setValue(title);
  }

  async isInputFocused(): Promise<boolean> {
    const $input = await this.$input;

    return await $input.isFocused();
  }

  @then(/^на форме появляются ошибки$/)
  async waitForErrors(): Promise<void> {
    const $error = await this.$error;
    await $error.waitForDisplayed();
  }

  @when(/^нажимаю кнопку Создать$/)
  async submit(): Promise<void> {
    const $submit = await this.$submit;
    await $submit.click();
    await browser.pause(500);
  }

  async cancel(): Promise<void> {
    const $cancel = await this.$cancel;
    await $cancel.click();
    await this.waitForHidden();
    await browser.pause(400);
  }
}

export const projectForm = new ProjectForm();
