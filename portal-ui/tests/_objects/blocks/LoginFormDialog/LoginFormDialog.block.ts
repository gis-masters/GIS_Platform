import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class LoginFormDialog extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.LoginFormDialog');
  }
}

export const loginFormDialog = new LoginFormDialog();
