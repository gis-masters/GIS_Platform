import { Block } from '../../Block';

class LibraryDocumentDialogBlock extends Block {
  selectors = {
    container: '.LibraryDocumentDialog'
  };
}

export const libraryDocumentDialogBlock = new LibraryDocumentDialogBlock();
