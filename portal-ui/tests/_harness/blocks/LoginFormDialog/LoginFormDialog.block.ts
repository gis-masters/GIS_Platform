import { Block } from '../../classes/Block';

class LoginFormDialog extends Block {
  selectors = {
    root: '.LoginFormDialog'
  };
}

export const loginFormDialog = new LoginFormDialog();
