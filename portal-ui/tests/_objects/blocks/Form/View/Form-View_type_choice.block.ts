import { Block } from '../../../Block';

class FormViewTypeChoiceBlock extends Block {
  selectors = {
    container: '.Form-View_type_choice'
  };
}

export const formViewTypeChoiceBlock = new FormViewTypeChoiceBlock();
