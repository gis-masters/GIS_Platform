import { Block } from '../../../Block';

class FormViewTypeUserBlock extends Block {
  selectors = {
    container: '.Form-View_type_user'
  };
}

export const formViewTypeUserBlock = new FormViewTypeUserBlock();
