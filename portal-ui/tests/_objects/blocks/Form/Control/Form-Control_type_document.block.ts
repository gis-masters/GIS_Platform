import { Block } from '../../../Block';
import { FormBlock } from '../Form.block';

class FormControlTypeDocumentBlock extends Block {
  selectors = {
    container: '.Form-Control_type_document'
  };

  async clickDocumentsAdd(container: string, title: string): Promise<void> {
    const formBlock = new FormBlock(container);
    const $field = await formBlock.getField(title);

    const $documentsAdd = await $field.$('.Documents-Add button');
    await $documentsAdd.click();
  }
}

export const formControlTypeDocumentBlock = new FormControlTypeDocumentBlock();
