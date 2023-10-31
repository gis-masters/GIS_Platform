import { Block } from '../../../Block';

export class XTableCellContentTypeStringBlock extends Block {
  selectors = {
    container: '.XTable-Cell .XTable-CellContent_type_string'
  };
}

export const xTableCellContentTypeStringBlock = new XTableCellContentTypeStringBlock();
