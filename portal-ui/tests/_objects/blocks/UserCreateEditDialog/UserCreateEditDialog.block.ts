import { Block } from '../../Block';

class UserCreateEditDialogBlock extends Block {
  selectors = {
    root: '.UserCreateEditDialog',
    loading: '.UserCreateEditDialog .Loading',
    saveBtn: '.UserCreateEditDialog .MuiButton-outlinedPrimary'
  };

  async clickSaveBtn(): Promise<void> {
    await this.waitForVisible();

    const $saveBtn = await this.findBySelector('saveBtn');
    await $saveBtn.waitForClickable();
    await $saveBtn.click();
  }

  async waitForVisible(): Promise<void> {
    await super.waitForVisible();
    await browser.pause(300); // анимация появления диалога

    const $loading = await this.findBySelector('loading');
    await $loading.waitForExist({ reverse: true });
  }
}

export const userCreateEditDialogBlock = new UserCreateEditDialogBlock();
