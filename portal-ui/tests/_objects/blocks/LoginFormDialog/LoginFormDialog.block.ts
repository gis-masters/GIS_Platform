import { Block } from '../../Block';

class LoginFormDialog extends Block {
  selectors = {
    root: '.LoginFormDialog'
  };
}

export const loginFormDialog = new LoginFormDialog();
