import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class CreateVectorTableDialogBlock extends Block {
  selectors = {
    container: '.CreateVectorTableDialog',
    dialogYes: '.CreateVectorTableDialog-Yes',
    formDialog: '.CreateVectorTableDialog .FormDialog'
  };

  async waitForFormDialogDisplayed(): Promise<void> {
    const $formDialog = await this.$('formDialog');
    await $formDialog.waitForDisplayed();
  }

  async waitForFormDialogClickable(): Promise<void> {
    const $formDialog = await this.$('formDialog');
    await $formDialog.waitForClickable();
  }

  async clickSaveFormDialog(): Promise<void> {
    const $editDialogYes = await this.$('dialogYes');
    await $editDialogYes.click();
    await $editDialogYes.waitForDisplayed({ reverse: true });
  }

  async openSchemaSelection() {
    const formBlock = new FormBlock(this.selectors.container);
    await formBlock.openSchemaSelection();
  }

  async setStringFieldValue(fieldTitle: string, value: string) {
    const formBlock = new FormBlock(this.selectors.container);
    await formBlock.setStringValue(fieldTitle, value);
  }

  async setChoiceFieldValue(fieldTitle: string, value: string) {
    const formBlock = new FormBlock(this.selectors.container);
    await formBlock.setChoiceValue(fieldTitle, value);
  }
}

export const createVectorTableDialogBlock = new CreateVectorTableDialogBlock();
