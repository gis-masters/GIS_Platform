import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../Block';

@binding()
class FormViewTypeString extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Form-View_type_string');
  }
}

export const formViewTypeString = new FormViewTypeString();
