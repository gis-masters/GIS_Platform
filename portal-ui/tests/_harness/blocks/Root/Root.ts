import { Block } from '../../classes/Block';

class Root extends Block {
  selectors = {
    root: '<crg-root />'
  };
}

export const root = new Root();
