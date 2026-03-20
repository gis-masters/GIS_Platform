import { Block } from '../../classes/Block';
import { formControlTypeDocumentBlock } from '../Form/Control/Form-Control_type_document.block';
import { FormBlock } from '../Form/Form.block';

class LibraryDocumentActionsEditDialogBlock extends Block {
  selectors = {
    root: '.LibraryDocumentActions-EditDialog'
  };

  async clickDocumentsAdd(title: string): Promise<void> {
    await formControlTypeDocumentBlock.clickDocumentsAdd(this.selectors.root, title);
  }

  async lookupFieldValues(title: string): Promise<string[]> {
    const formBlock = new FormBlock(this.selectors.root);

    return formBlock.lookupFieldValues(title);
  }
}

export const libraryDocumentActionsEditDialogBlock = new LibraryDocumentActionsEditDialogBlock();
