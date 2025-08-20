import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class ProjectActionsBlock extends Block {
  selectors = {
    container: '.ProjectActions',
    deleteBtn: '.ProjectActions .ProjectActions-Delete',
    editBtn: '.ProjectActions .ProjectActions-Edit',
    moveBtn: '.ProjectActions .ProjectActions-Move',
    editDialog: '.ProjectActions-EditDialog',
    editDialogSave: '.ProjectActions-EditDialog .MuiButton-outlinedPrimary'
  };

  async clickDeleteBtn(): Promise<void> {
    const $deleteBtn = await this.$('deleteBtn');
    await $deleteBtn.waitForDisplayed();
    await $deleteBtn.click();
  }

  async clickMoveBtn(): Promise<void> {
    const $moveBtn = await this.$('moveBtn');
    await $moveBtn.waitForDisplayed();
    await $moveBtn.click();
  }

  async deleteBtnNotExist(): Promise<void> {
    const $deleteBtn = await this.$('deleteBtn');
    await $deleteBtn.waitForExist({ reverse: true });
  }

  async editBtnNotExist(): Promise<void> {
    const $deleteBtn = await this.$('editBtn');
    await $deleteBtn.waitForExist({ reverse: true });
  }

  async clickEditBtn(): Promise<void> {
    const $editBtn = await this.$('editBtn');
    await $editBtn.waitForDisplayed();
    await $editBtn.click();
  }

  async editProject(fieldName: string, fieldValue: string): Promise<void> {
    const $editDialogYes = await this.$('editDialogSave');
    await $editDialogYes.waitForDisplayed();

    const formBlock = new FormBlock(this.selectors.editDialog);
    await formBlock.replaceStringValue(fieldName, fieldValue);

    await $editDialogYes.click();
    await $editDialogYes.waitForDisplayed({ reverse: true });
  }
}

export const projectActionsBlock = new ProjectActionsBlock();
