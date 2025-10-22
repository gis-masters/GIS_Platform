import { Block } from '../../../Block';
import { FormBlock } from '../../Form/Form.block';

class CreateProjectDialogBlock extends Block {
  selectors = {
    container: '.CreateProject-Dialog',
    form: '.CreateProject-Dialog .Form',
    submit: '.CreateProject-Dialog .MuiButton-outlinedPrimary'
  };

  async setFieldValue(field: string, title: string): Promise<void> {
    const formBlock = new FormBlock(await this.findBySelector('container'));
    const $field = await formBlock.getField(field);
    const $fieldInput = await $field.$('input').getElement();
    await $fieldInput.setValue(title);
  }

  async submit(): Promise<void> {
    const $submit = await this.findBySelector('submit');
    await $submit.click();
    await $submit.waitForExist({ reverse: true });
  }
}

export const createProjectDialogBlock = new CreateProjectDialogBlock();
