import { Block } from '../../../classes/Block';

export class XTableCellContentTypeChoiceBlock extends Block {
  selectors = {
    root: '.XTable-Cell .XTable-CellContent_type_choice'
  };
}

export const xTableCellContentTypeChoiceBlock = new XTableCellContentTypeChoiceBlock();
