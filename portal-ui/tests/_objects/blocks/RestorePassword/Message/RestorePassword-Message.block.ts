import { Block } from '../../../Block';

class RestorePasswordMessageBlock extends Block {
  selectors = {
    root: '.RestorePassword-Message'
  };
}

export const restorePasswordMessageBlock = new RestorePasswordMessageBlock();
