import { Block } from '../../Block';

class FormStoryActionsBlock extends Block {
  selectors = {
    root: '.StoryWrapper .Form-Actions',
    validate: '.StoryWrapper .FormStoryActions-ValidateData'
  };

  async clickValidate(): Promise<void> {
    const $validate = await this.findBySelector('validate');
    await $validate.waitForClickable();
    await $validate.click();
  }
}

export const formStoryActionsBlock = new FormStoryActionsBlock();
