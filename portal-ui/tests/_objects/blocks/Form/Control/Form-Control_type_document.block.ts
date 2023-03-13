import { Block } from '../../../Block';

class FormControlTypeDocumentBlock extends Block {
  selectors = {
    container: '.Form-Control_type_document'
  };
}

export const formControlTypeDocumentBlock = new FormControlTypeDocumentBlock();
