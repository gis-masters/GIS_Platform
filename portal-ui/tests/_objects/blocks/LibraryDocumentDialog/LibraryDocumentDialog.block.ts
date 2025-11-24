import { Block } from '../../Block';
import { LibraryDocumentBlock } from '../LibraryDocument/LibraryDocument.block';

class LibraryDocumentDialogBlock extends Block {
  selectors = {
    root: '.LibraryDocumentDialog'
  };

  async getFieldValue(field: string): Promise<string> {
    const libraryDocumentBlock = new LibraryDocumentBlock(await this.findBySelector('root'));

    return await libraryDocumentBlock.getFieldValue(field);
  }
}

export const libraryDocumentDialogBlock = new LibraryDocumentDialogBlock();
