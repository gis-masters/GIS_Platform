import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class DatasetActionsBlock extends Block {
  selectors = {
    container: '.DatasetActions',
    deleteBtn: '.DatasetActions .DatasetActions-Delete',
    editBtn: '.DatasetActions .DatasetActions-Edit',
    dialogEdit: '.DatasetActions-EditDialog',
    dialogEditFields: '.DatasetActions-Dialog .Form-Field',
    dialogEditYes: '.DatasetActions-EditDialogYes'
  };

  async clickDeleteBtn(): Promise<void> {
    const $deleteBtn = await this.$('deleteBtn');
    await $deleteBtn.waitForDisplayed();
    await $deleteBtn.click();
  }

  async isDeleteBtnEnabled(): Promise<boolean> {
    const $deleteBtn = await this.$('deleteBtn');
    await $deleteBtn.waitForDisplayed();

    return await $deleteBtn.isEnabled();
  }

  async isEditBtnEnabled(): Promise<boolean> {
    const $editBtn = await this.$('editBtn');
    await $editBtn.waitForDisplayed();

    return await $editBtn.isEnabled();
  }

  async clickEditBtn(): Promise<void> {
    const $editBtn = await this.$('editBtn');
    await $editBtn.waitForDisplayed();
    await $editBtn.click();
  }

  async editDataset(fieldName: string, fieldValue: string): Promise<void> {
    const $editDialogYes = await this.$('dialogEditYes');
    await $editDialogYes.waitForDisplayed();

    const formBlock = new FormBlock(this.selectors.dialogEdit);
    await formBlock.replaceStringValue(fieldName, fieldValue);

    await $editDialogYes.click();
    await $editDialogYes.waitForDisplayed({ reverse: true });
  }
}

export const datasetActionsBlock = new DatasetActionsBlock();
