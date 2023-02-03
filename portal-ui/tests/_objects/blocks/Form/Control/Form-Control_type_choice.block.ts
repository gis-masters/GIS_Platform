import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../Block';

@binding()
class FormControlTypeChoice extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Form-Control_type_choice');
  }
}

export const formControlTypeChoice = new FormControlTypeChoice();
