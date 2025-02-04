import { Block } from '../../Block';

class SelectSchemaControlDialogBlock extends Block {
  selectors = {
    container: '.SelectSchemaControl-Dialog',
    xTable: '.SelectSchemaControl-Dialog .XTable',
    yes: '.SelectSchemaControl-Dialog .MuiButton-outlinedPrimary',
    inputs: '.SelectSchemaControl-Dialog .PrivateSwitchBase-input'
  };

  async waitForSelectSchemaTableDisplay(): Promise<void> {
    const $xTable = await this.$('xTable');
    await $xTable.waitForDisplayed();
  }

  async clickSelectSchemaFirstOption(): Promise<void> {
    const $$inputs = await this.$$('inputs');
    await $$inputs[0].click();
  }

  async clickSelectSchemaConfirm(): Promise<void> {
    const $yes = await this.$('yes');
    await $yes.click();
  }

  async waitForSelectSchemaDisappear(): Promise<void> {
    const $yes = await this.$('yes');
    await $yes.waitForDisplayed({ reverse: true });
  }
}

export const selectSchemaControlDialogBlock = new SelectSchemaControlDialogBlock();
