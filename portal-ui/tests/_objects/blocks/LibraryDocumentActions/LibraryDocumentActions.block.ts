import { Block } from '../../Block';

class LibraryDocumentActionsBlock extends Block {
  selectors = {
    container: '.LibraryDocumentActions',
    edit: '.LibraryDocumentActions-Edit'
  };

  async clickEditButton(): Promise<void> {
    const $edit = await this.$('edit');
    await $edit.waitForClickable();

    await $edit.click();
  }
}

export const libraryDocumentActionsBlock = new LibraryDocumentActionsBlock();
