import { Block } from '../../Block';

class LoginFormDialog extends Block {
  selectors = {
    container: '.LoginFormDialog'
  };
}

export const loginFormDialog = new LoginFormDialog();
