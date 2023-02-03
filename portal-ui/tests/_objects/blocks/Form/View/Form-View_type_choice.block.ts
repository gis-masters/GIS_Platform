import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../Block';

@binding()
class FormViewTypeChoice extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Form-View_type_choice');
  }
}

export const formViewTypeChoice = new FormViewTypeChoice();
