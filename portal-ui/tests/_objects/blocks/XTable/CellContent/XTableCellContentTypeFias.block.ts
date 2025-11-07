import { Block } from '../../../Block';

export class XTableCellContentTypeFiasBlock extends Block {
  selectors = {
    root: '.XTable-Cell .XTable-CellContent_type_fias'
  };
}

export const xTableCellContentTypeFiasBlock = new XTableCellContentTypeFiasBlock();
