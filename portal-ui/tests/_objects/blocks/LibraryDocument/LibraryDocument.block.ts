import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

export class LibraryDocumentBlock extends Block {
  selectors = {
    root: '.LibraryDocument',
    documentCard: '.LibraryDocument-DocumentCard'
  };

  async getFieldValue(field: string): Promise<string> {
    const formBlock = new FormBlock(await this.findBySelector('documentCard'));
    const $field = await formBlock.getField(field);

    return $field.$('.Form-View').getText();
  }
}
