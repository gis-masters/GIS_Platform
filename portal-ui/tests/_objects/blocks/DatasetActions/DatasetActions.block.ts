import { Block } from '../../Block';

class DatasetActionsBlock extends Block {
  selectors = {
    container: '.DatasetActions',
    deleteBtn: '.DatasetActions .DatasetActions-Delete',
    editBtn: '.DatasetActions .DatasetActions-Edit',
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
    const $deleteBtn = await this.$('editBtn');
    await $deleteBtn.waitForExist();
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
