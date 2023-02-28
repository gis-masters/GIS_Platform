import { Block } from '../../../Block';

class FormControlTypeString extends Block {
  selectors = {
    container: '.Form-Control_type_string'
  };
}

export const formControlTypeString = new FormControlTypeString();
