import { Block } from '../../Block';

class UrlListDialogBlock extends Block {
  selectors = {
    container: '.UrlsList-Dialog'
  };
}

export const urlListDialogBlock = new UrlListDialogBlock();
