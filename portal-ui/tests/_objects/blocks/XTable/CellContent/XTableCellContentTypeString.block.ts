import { Block } from '../../../Block';

export class XTableCellContentTypeStringBlock extends Block {
  selectors = {
    root: '.XTable-Cell .XTable-CellContent_type_string'
  };
}

export const xTableCellContentTypeStringBlock = new XTableCellContentTypeStringBlock();
