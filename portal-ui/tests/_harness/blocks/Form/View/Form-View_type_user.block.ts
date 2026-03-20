import { Block } from '../../../classes/Block';

class FormViewTypeUserBlock extends Block {
  selectors = {
    root: '.Form-View_type_user'
  };
}

export const formViewTypeUserBlock = new FormViewTypeUserBlock();
