import { Block } from '../../Block';

class LibraryDocumentActionsDeleteDialogBlock extends Block {
  selectors = {
    container: '.LibraryDocumentActions-DeleteDialog',
    delete: '.LibraryDocumentActions-DeleteDialog .MuiButton-outlinedPrimary'
  };

  async delete(): Promise<void> {
    await this.waitForVisible();
    const $save = await this.findBySelector('delete');
    await $save.click();
    await $save.waitForExist({ reverse: true });
  }
}

export const libraryDocumentActionsDeleteDialogBlock = new LibraryDocumentActionsDeleteDialogBlock();
