import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';
import { xTableBlock } from '../XTable/XTable.block';

class CreateVectorTableDialogBlock extends Block {
  selectors = {
    container: '.CreateVectorTableDialog',
    dialogYes: '.CreateVectorTableDialog-Yes'
  };

  async clickSaveFormDialog(): Promise<void> {
    const $editDialogYes = await this.$('dialogYes');
    await $editDialogYes.waitForDisplayed();
    await $editDialogYes.click();
    await $editDialogYes.waitForDisplayed({ reverse: true });
  }

  async openSchemaSelection() {
    const formBlock = new FormBlock(this.selectors.container);
    await formBlock.openSchemaSelection();
    await xTableBlock.waitForLoading();
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
