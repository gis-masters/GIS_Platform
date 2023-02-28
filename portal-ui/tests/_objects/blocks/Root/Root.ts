import { Block } from '../../Block';

class Root extends Block {
  selectors = {
    container: '<crg-root />'
  };
}

export const root = new Root();
