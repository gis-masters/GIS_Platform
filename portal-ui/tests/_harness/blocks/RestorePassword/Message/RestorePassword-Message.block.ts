import { Block } from '../../../classes/Block';

class RestorePasswordMessageBlock extends Block {
  selectors = {
    root: '.RestorePassword-Message'
  };
}

export const restorePasswordMessageBlock = new RestorePasswordMessageBlock();
