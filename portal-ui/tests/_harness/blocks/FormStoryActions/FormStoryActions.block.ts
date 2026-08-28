import { Block } from '../../classes/Block';

class FormStoryActionsBlock extends Block {
  selectors = {
    root: '.StoryWrapper .Form-Actions',
    validate: '.StoryWrapper .FormStoryActions-ValidateData',
    clear: '.StoryWrapper .FormStoryActions-ClearData',
    setValidData: '.StoryWrapper .FormStoryActions-SetValidData',
    setErrorData: '.StoryWrapper .FormStoryActions-SetErrorData'
  };

  async clickValidate(): Promise<void> {
    await this.clickButton('validate');
  }

  async clickClear(): Promise<void> {
    await this.clickButton('clear');
  }

  async clickSetValidData(): Promise<void> {
    await this.clickButton('setValidData');
  }

  async clickSetErrorData(): Promise<void> {
    await this.clickButton('setErrorData');
  }

  private async clickButton(key: keyof this['selectors']): Promise<void> {
    const $button = await this.findBySelector(key);
    await $button.waitForClickable();
    await $button.click();
  }
}

export const formStoryActionsBlock = new FormStoryActionsBlock();
