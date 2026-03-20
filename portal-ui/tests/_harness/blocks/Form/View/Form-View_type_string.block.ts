import { Block } from '../../../classes/Block';

class FormViewTypeStringBlock extends Block {
  selectors = {
    root: '.Form-View_type_string'
  };
}

export const formViewTypeStringBlock = new FormViewTypeStringBlock();
