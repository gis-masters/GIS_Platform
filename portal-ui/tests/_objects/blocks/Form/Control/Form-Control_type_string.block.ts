import { Block } from '../../../Block';

class FormControlTypeStringBlock extends Block {
  selectors = {
    container: '.Form-Control_type_string'
  };
}

export const formControlTypeStringBlock = new FormControlTypeStringBlock();
