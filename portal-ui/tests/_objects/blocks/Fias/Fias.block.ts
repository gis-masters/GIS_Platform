import { Block } from '../../Block';

class FiasBlock extends Block {
  selectors = {
    container: '.Fias'
  };
}

export const fiasBlock = new FiasBlock();
