import { Block } from '../../../classes/Block';
import { FormBlock } from '../Form.block';

class FormControlTypeUserIdBlock extends Block {
  selectors = {
    root: '.Form-Control_type_userId'
  };

  async clearSelectedUser(title: string): Promise<void> {
    const formBlock = new FormBlock();
    const $field = await formBlock.getField(title);

    const $deleteUserBtn = await $field.$('.Lookup-Delete').getElement();

    if (await $deleteUserBtn.isExisting()) {
      await $deleteUserBtn.click();
    }
  }

  async clickDeleteUserBtn(title: string): Promise<void> {
    const formBlock = new FormBlock();
    const $field = await formBlock.getField(title);

    const $deleteUserBtn = await $field.$('.Lookup-Delete').getElement();
    await $deleteUserBtn.waitForClickable();
    await $deleteUserBtn.click();
  }
}

export const formControlTypeUserIdBlock = new FormControlTypeUserIdBlock();
