import { Block } from '../../../Block';

class FormContentBlock extends Block {
  selectors = {
    container: '.Form-Content'
  };
}

export const formContentBlock = new FormContentBlock();
