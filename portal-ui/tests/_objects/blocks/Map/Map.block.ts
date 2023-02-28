import { Block } from '../../Block';

class Map extends Block {
  selectors = {
    container: '.map'
  };
}

export const map = new Map();
