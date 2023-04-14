import { Block } from '../../Block';

class SchemasSelectDialogBlock extends Block {
  selectors = {
    container: '.SchemasSelect-Dialog',
    schemasSelectDialogXTable: '.SchemasSelect-Dialog .XTable',
    schemasSelectDialogYes: '.SchemasSelect-Dialog .MuiButton-outlinedPrimary',
    schemasSelectDialogInputs: '.SchemasSelect-Dialog .PrivateSwitchBase-input'
  };

  async waitForSelectSchemaTableDisplay(): Promise<void> {
    const $schemasSelectDialogXTable = await this.$('schemasSelectDialogXTable');
    await $schemasSelectDialogXTable.waitForDisplayed();
  }

  async clickSelectSchemaFirstOption(): Promise<void> {
    const $$schemasSelectDialogInputs = await this.$$('schemasSelectDialogInputs');
    await $$schemasSelectDialogInputs[0].click();
  }

  async clickSelectSchemaConfirm(): Promise<void> {
    const $schemasSelectDialogYes = await this.$('schemasSelectDialogYes');
    await $schemasSelectDialogYes.click();
  }

  async waitForSelectSchemaDisappear(): Promise<void> {
    const $schemasSelectDialogYes = await this.$('schemasSelectDialogYes');
    await $schemasSelectDialogYes.waitForDisplayed({ reverse: true });
  }
}

export const schemasSelectDialogBlock = new SchemasSelectDialogBlock();
