import { Block } from '../../Block';

class CreateBufferDialogBlock extends Block {
  selectors = {
    root: '.CreateBufferDialog',
    createBtn: '.CreateBufferDialog .MuiButton-outlinedPrimary'
  };

  async clickCreateBuffer(): Promise<void> {
    const $createBtn = await this.findBySelector('createBtn');
    await $createBtn.waitForClickable();
    await $createBtn.click();

    await this.waitForHidden();
  }

  async waitForDialogShow(): Promise<void> {
    await this.waitForVisible();
  }
}

export const createBufferDialogBlock = new CreateBufferDialogBlock();
