import { Block } from '../../../classes/Block';

class FormViewTypeChoiceBlock extends Block {
  selectors = {
    root: '.Form-View_type_choice'
  };
}

export const formViewTypeChoiceBlock = new FormViewTypeChoiceBlock();
