import { Block } from '../../../Block';

class FormControlTypeChoiceBlock extends Block {
  selectors = {
    container: '.Form-Control_type_choice'
  };
}

export const formControlTypeChoiceBlock = new FormControlTypeChoiceBlock();
