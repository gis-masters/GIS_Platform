import { Block } from '../../../Block';
import { FormBlock } from '../../Form/Form.block';

class LibraryDocumentActionsEditDialogBlock extends Block {
  selectors = {
    container: '.LibraryDocumentActions-EditDialog',
    save: '.LibraryDocumentActions-EditDialog .MuiButton-outlinedPrimary'
  };

  async clickDeleteFilesInField(field: string) {
    const formBlock = new FormBlock(await this.$('container'));
    const $field = await formBlock.getField(field);

    const $delete = await $field.$('.Lookup-Delete');
    await $delete.waitForClickable();
    await $delete.click();
  }

  async clickSave() {
    const $save = await this.$('save');
    await $save.click();
  }
}

export const libraryDocumentActionsEditDialogBlock = new LibraryDocumentActionsEditDialogBlock();
