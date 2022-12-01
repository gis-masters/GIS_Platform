import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../Block';

@binding()
class FormControlTypeDocument extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Form-Control_type_document');
  }
}

export const formControlTypeDocument = new FormControlTypeDocument();
