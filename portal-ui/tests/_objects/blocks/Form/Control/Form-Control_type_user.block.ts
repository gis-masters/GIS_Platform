import { Block } from '../../../Block';
import { FormBlock } from '../Form.block';

class FormControlTypeUserBlock extends Block {
  selectors = {
    root: '.Form-Control_type_user'
  };

  async clickAddUserBtn(title: string): Promise<void> {
    const formBlock = new FormBlock();
    const $field = await formBlock.getField(title);
    const $addUserBtn = await $field.$('.Users-Add').getElement();

    await $addUserBtn.click();
  }
}

export const formControlTypeUserBlock = new FormControlTypeUserBlock();
