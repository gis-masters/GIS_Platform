import { Block } from '../../../classes/Block';

class FormControlTypeStringBlock extends Block {
  selectors = {
    root: '.Form-Control_type_string'
  };
}

export const formControlTypeStringBlock = new FormControlTypeStringBlock();
