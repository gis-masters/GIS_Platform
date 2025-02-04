import { Block } from '../../Block';

class ProjectFormBlock extends Block {
  selectors = {
    container: '.ProjectForm',
    input: '.ProjectForm-Input input',
    submit: '.ProjectForm-Button_action_submit',
    cancel: '.ProjectForm-Button_action_cancel',
    error: '.ProjectForm-Error'
  };

  async getInputValue(): Promise<string> {
    const $input = await this.$('input');

    return await $input.getValue();
  }

  async setInputValue(title: string): Promise<void> {
    const $input = await this.$('input');
    await $input.setValue(title);
  }

  async testInputValue(title: string) {
    await expect(await this.getInputValue()).toEqual(title);
  }

  async inputIsFocused(): Promise<void> {
    await expect(this.$('input')).toBeFocused();
  }

  async waitForErrors(): Promise<void> {
    const $error = await this.$('error');
    await $error.waitForDisplayed();
  }

  async errorsAreEmpty(): Promise<void> {
    await expect(this.$('error')).not.toBeDisplayed();
  }

  async submit(): Promise<void> {
    const $submit = await this.$('submit');
    await $submit.click();
    await browser.pause(500);
  }

  async cancel(): Promise<void> {
    const $cancel = await this.$('cancel');
    await $cancel.click();
    await this.waitForHidden();
    await browser.pause(400);
  }
}

export const projectFormBlock = new ProjectFormBlock();
