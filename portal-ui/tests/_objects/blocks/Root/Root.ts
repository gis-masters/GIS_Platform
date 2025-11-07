import { Block } from '../../Block';

class Root extends Block {
  selectors = {
    root: '<crg-root />'
  };
}

export const root = new Root();
