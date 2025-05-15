import { Block } from '../../../Block';
import { FormBlock } from '../../Form/Form.block';

class CreateProjectFolderDialogBlock extends Block {
  selectors = {
    container: '.CreateProjectFolder-Dialog',
    form: '.CreateProjectFolder-Dialog .Form',
    submit: '.CreateProjectFolder-Dialog .MuiButton-outlinedPrimary'
  };

  async setFieldValue(field: string, title: string): Promise<void> {
    const formBlock = new FormBlock(await this.$('container'));
    const $field = await formBlock.getField(field);
    const $fieldInput = await $field.$('input');
    await $fieldInput.setValue(title);
  }

  async submit(): Promise<void> {
    const $submit = await this.$('submit');
    await $submit.click();
    await $submit.waitForDisplayed({ reverse: true });
  }
}

export const createProjectFolderDialogBlock = new CreateProjectFolderDialogBlock();
