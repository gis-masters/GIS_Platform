import { Block } from '../../Block';

class UserCreateEditDialogBlock extends Block {
  selectors = {
    container: '.UserCreateEditDialog',
    loading: '.UserCreateEditDialog .Loading',
    saveBtn: '.UserCreateEditDialog .MuiButton-outlinedPrimary'
  };

  async clickSaveBtn(): Promise<void> {
    await this.waitForVisible();

    const $saveBtn = await this.$('saveBtn');
    await $saveBtn.waitForClickable();
    await $saveBtn.click();
  }

  async waitForVisible(): Promise<void> {
    await super.waitForVisible();
    await browser.pause(300); // анимация появления диалога

    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
  }
}

export const userCreateEditDialogBlock = new UserCreateEditDialogBlock();
