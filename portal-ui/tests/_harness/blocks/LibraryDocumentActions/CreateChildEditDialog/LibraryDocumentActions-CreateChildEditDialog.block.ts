import { Block } from '../../../classes/Block';

class LibraryDocumentActionsCreateChildEditDialogBlock extends Block {
  selectors = {
    root: '.LibraryDocumentActions-CreateChildEditDialog',
    save: '.LibraryDocumentActions-CreateChildEditDialog .MuiButton-outlined.MuiButton-colorPrimary'
  };

  async clickSave() {
    const $save = await this.findBySelector('save');
    await $save.waitForClickable();
    await $save.click();
  }
}

export const libraryDocumentActionsCreateChildEditDialogBlock = new LibraryDocumentActionsCreateChildEditDialogBlock();
