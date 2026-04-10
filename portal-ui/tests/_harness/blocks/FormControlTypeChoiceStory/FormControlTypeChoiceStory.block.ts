import { Block } from '../../classes/Block';
import { FormBlock } from '../Form/Form.block';

class FormControlTypeChoiceStoryBlock extends Block {
  selectors = {
    root: '.FormControlTypeChoiceStory',
    send: '.FormControlTypeChoiceStory-Send'
  };

  async clickSend(): Promise<void> {
    const $send = await this.findBySelector('send');
    await $send.waitForClickable();
    await $send.click();
  }

  async getChoiceValue(fieldTitle: string): Promise<string> {
    const $root = await this.findBySelector('root');
    const form = new FormBlock(null, $root);

    return await form.getChoiceValue(fieldTitle);
  }

  async setChoiceValue(fieldTitle: string, value: string): Promise<void> {
    const $root = await this.findBySelector('root');
    const form = new FormBlock(null, $root);

    await form.setChoiceValue(fieldTitle, value);
  }

  async setChoiceMultipleValues(fieldTitle: string, values: string[]): Promise<void> {
    const $root = await this.findBySelector('root');
    const form = new FormBlock(null, $root);

    await form.setChoiceMultipleValues(fieldTitle, values);
  }
}

export const formControlTypeChoiceStoryBlock = new FormControlTypeChoiceStoryBlock();
