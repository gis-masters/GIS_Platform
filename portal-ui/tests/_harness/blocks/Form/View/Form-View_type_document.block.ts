import { Block } from '../../../classes/Block';

class FormViewTypeDocumentBlock extends Block {
  selectors = {
    root: '.Form-View_type_document'
  };
}

export const formViewTypeDocumentBlock = new FormViewTypeDocumentBlock();
