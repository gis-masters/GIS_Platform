import { Block } from '../../Block';

class SelectSchemaControlDialogBlock extends Block {
  selectors = {
    root: '.SelectSchemaControl-Dialog',
    xTable: '.SelectSchemaControl-Dialog .XTable',
    yes: '.SelectSchemaControl-Dialog .MuiButton-outlinedPrimary',
    filters: '.SelectSchemaControl-Dialog .XTable-HeadCell_filterable',
    inputs: '.SelectSchemaControl-Dialog .PrivateSwitchBase-input'
  };

  async waitForSelectSchemaTableDisplay(): Promise<void> {
    const $xTable = await this.findBySelector('xTable');
    await $xTable.waitForDisplayed();
  }

  async clickSelectSchemaFirstOption(): Promise<void> {
    await this.waitForSelectSchemaTableDisplay();

    const $$inputs = await this.findAllBySelector('inputs');
    await $$inputs[0].click();
  }

  async setOptionTitleFilter(): Promise<void> {
    const $$filters = await this.findAllBySelector('filters');
    const $input = await $$filters[0].$('.MuiInputBase-input').getElement();

    await $input.setValue('без');
    await browser.pause(300);
  }

  async clickSelectSchemaConfirm(): Promise<void> {
    const $yes = await this.findBySelector('yes');
    await $yes.click();
  }

  async waitForSelectSchemaDisappear(): Promise<void> {
    const $yes = await this.findBySelector('yes');
    await $yes.waitForExist({ reverse: true });
  }
}

export const selectSchemaControlDialogBlock = new SelectSchemaControlDialogBlock();
