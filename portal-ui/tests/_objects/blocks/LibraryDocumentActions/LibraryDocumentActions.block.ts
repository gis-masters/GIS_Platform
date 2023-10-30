import { Block } from '../../Block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';

class LibraryDocumentActionsBlock extends Block {
  selectors = {
    container: '.LibraryDocumentActions',
    edit: '.LibraryDocumentActions-Edit',
    createChild: '.LibraryDocumentActions-CreateChild',
    delete: '.LibraryDocumentActions-Delete'
  };

  async clickEditButton(): Promise<void> {
    const $edit = await this.$('edit');
    await $edit.waitForClickable();

    await $edit.click();
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
