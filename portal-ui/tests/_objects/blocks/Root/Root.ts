import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class Root extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('<crg-root />');
  }
}

export const root = new Root();
