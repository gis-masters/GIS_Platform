import { Block } from '../../Block';

class LibraryDocumentActionsBlock extends Block {
  selectors = {
    container: '.LibraryDocumentActions',
    edit: '.LibraryDocumentActions-Edit',
    delete: '.LibraryDocumentActions-Delete'
  };

  async clickEditButton(): Promise<void> {
    const $edit = await this.$('edit');
    await $edit.waitForClickable();

    await $edit.click();
  }

  async clickDeleteButton(): Promise<void> {
    const $delete = await this.$('delete');
    await $delete.waitForClickable();

    await $delete.click();
  }
}

export const libraryDocumentActionsBlock = new LibraryDocumentActionsBlock();
