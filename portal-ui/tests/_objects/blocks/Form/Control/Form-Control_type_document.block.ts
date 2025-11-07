import { Block } from '../../../Block';
import { FormBlock } from '../Form.block';

class FormControlTypeDocumentBlock extends Block {
  selectors = {
    root: '.Form-Control_type_document'
  };

  async clickDocumentsAdd(root: string, title: string): Promise<void> {
    const formBlock = new FormBlock(root);
    const $field = await formBlock.getField(title);

    const $documentsAdd = await $field.$('.Documents-Add button').getElement();
    await $documentsAdd.click();
  }
}

export const formControlTypeDocumentBlock = new FormControlTypeDocumentBlock();
