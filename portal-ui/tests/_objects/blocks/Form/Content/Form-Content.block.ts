import { Block } from '../../../Block';

class FormContentBlock extends Block {
  selectors = {
    root: '.Form-Content'
  };
}

export const formContentBlock = new FormContentBlock();
