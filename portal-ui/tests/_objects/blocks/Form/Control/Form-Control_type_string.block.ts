import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../Block';

@binding()
class FormControlTypeString extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Form-Control_type_string');
  }
}

export const formControlTypeString = new FormControlTypeString();
