import { Block } from '../../../classes/Block';

class FormControlTypeChoiceBlock extends Block {
  selectors = {
    root: '.Form-Control_type_choice'
  };
}

export const formControlTypeChoiceBlock = new FormControlTypeChoiceBlock();
