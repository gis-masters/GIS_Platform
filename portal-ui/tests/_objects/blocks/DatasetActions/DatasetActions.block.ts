import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class DatasetActionsBlock extends Block {
  selectors = {
    container: '.DatasetActions',
    deleteBtn: '.DatasetActions .DatasetActions-Delete',
    editBtn: '.DatasetActions .DatasetActions-Edit',
    dialogEdit: '.DatasetActions-Dialog',
    dialogEditFields: '.DatasetActions-Dialog .Form-Field',
    dialogEditYes: '.DatasetActions-DialogYes',
    deleteDialogYes: '.DatasetActions-DeleteDialogYes',
    deleteProhibitDeletionDialog: '.DatasetActions-DeleteProhibitDeletionDialog'
  };

  async clickDeleteBtn(): Promise<void> {
    const $deleteBtn = await this.$('deleteBtn');
    await $deleteBtn.waitForDisplayed();
    await $deleteBtn.click();
  }

  async deleteBtnNotExist(): Promise<void> {
    const $deleteBtn = await this.$('deleteBtn');
    await $deleteBtn.waitForExist({ reverse: true });
  }

  async editBtnNotExist(): Promise<void> {
    const $deleteBtn = await this.$('editBtn');
    await $deleteBtn.waitForExist({ reverse: true });
  }

  async editBtnExist(): Promise<void> {
    const $editBtn = await this.$('editBtn');
    await $editBtn.waitForExist();
  }

  async clickEditBtn(): Promise<void> {
    const $editBtn = await this.$('editBtn');
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

  async getDatasetEditDialogField(fieldName: string): Promise<WebdriverIO.Element | undefined> {
    const $$dialogEditFields = await this.$$('dialogEditFields');

    for (const $editField of $$dialogEditFields) {
      const editFieldName = await $editField.getText();

      if (editFieldName === fieldName) {
        return await $editField.$('.MuiInputBase-root');
      }
    }
  }

  async confirmDeletion(): Promise<void> {
    const $confirmDeletionBtn = await this.$('deleteDialogYes');
    await $confirmDeletionBtn.waitForDisplayed();
    await $confirmDeletionBtn.click();
    await $confirmDeletionBtn.waitForDisplayed({ reverse: true });
  }

  async prohibitDeletionDialog(): Promise<void> {
    const $prohibitDeletionDialog = await this.$('deleteProhibitDeletionDialog');
    await $prohibitDeletionDialog.waitForDisplayed();
  }
}

export const datasetActionsBlock = new DatasetActionsBlock();
