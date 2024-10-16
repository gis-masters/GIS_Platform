import { Block } from '../../Block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';

class LibraryDocumentActionsBlock extends Block {
  selectors = {
    container: '.LibraryDocumentActions',
    edit: '.LibraryDocumentActions-Edit',
    createChild: '.LibraryDocumentActions-CreateChild',
    delete: '.LibraryDocumentActions-Delete',
    move: '.LibraryDocumentActions-Move'
  };

  async clickEditButton(): Promise<void> {
    const $edit = await this.$('edit');
    await $edit.waitForClickable();

    await $edit.click();
  }

  async clickDocumentMoveBtn(): Promise<void> {
    const $moveBtn = await this.$('move');
    await $moveBtn.waitForDisplayed();
    await $moveBtn.click();
  }

  async documentMoveBtnDisabled(): Promise<boolean> {
    await this.waitForVisible();

    const $moveBtn = await this.$('move');
    await $moveBtn.waitForDisplayed();

    return await $moveBtn.isEnabled();
  }

  async documentMoveBtnExist(): Promise<boolean> {
    await this.waitForVisible();

    const $moveBtn = await this.$('move');
    await $moveBtn.waitForDisplayed();

    return await $moveBtn.isExisting();
  }

  async clickCreateChildDocButton(contentType: string): Promise<void> {
    const $createChild = await this.$('createChild');
    await $createChild.waitForClickable();
    await $createChild.click();

    const muiSelect = new MuiMenuBlock();
    await muiSelect.waitForVisible();
    await muiSelect.clickItemByTitle(contentType);
  }

  async clickDeleteButton(): Promise<void> {
    const $delete = await this.$('delete');
    await $delete.waitForClickable();

    await $delete.click();
  }
}

export const libraryDocumentActionsBlock = new LibraryDocumentActionsBlock();
