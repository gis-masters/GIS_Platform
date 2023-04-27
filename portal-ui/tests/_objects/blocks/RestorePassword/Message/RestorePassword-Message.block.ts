import { Block } from '../../../Block';

class RestorePasswordMessageBlock extends Block {
  selectors = {
    container: '.RestorePassword-Message'
  };
}

export const restorePasswordMessageBlock = new RestorePasswordMessageBlock();
