import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../Block';

@binding()
class FormViewTypeDocument extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Form-View_type_document');
  }
}

export const formViewTypeDocument = new FormViewTypeDocument();
