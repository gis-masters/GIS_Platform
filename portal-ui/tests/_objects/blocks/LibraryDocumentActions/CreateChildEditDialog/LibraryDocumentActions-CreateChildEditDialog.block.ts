import { Block } from '../../../Block';

class LibraryDocumentActionsCreateChildEditDialogBlock extends Block {
  selectors = {
    root: '.LibraryDocumentActions-CreateChildEditDialog',
    save: '.LibraryDocumentActions-CreateChildEditDialog .MuiButton-outlinedPrimary'
  };

  async clickSave() {
    const $save = await this.findBySelector('save');
    await $save.waitForClickable();
    await $save.click();
  }
}

export const libraryDocumentActionsCreateChildEditDialogBlock = new LibraryDocumentActionsCreateChildEditDialogBlock();
