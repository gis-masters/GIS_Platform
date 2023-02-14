import { binding } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class Map extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.map');
  }
}

export const map = new Map();
