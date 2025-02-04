import { Block } from '../../../Block';

export class XTableCellContentTypeChoiceBlock extends Block {
  selectors = {
    container: '.XTable-Cell .XTable-CellContent_type_choice'
  };
}

export const xTableCellContentTypeChoiceBlock = new XTableCellContentTypeChoiceBlock();
