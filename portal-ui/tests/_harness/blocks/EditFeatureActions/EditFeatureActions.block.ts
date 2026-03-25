import { Block } from '../../classes/Block';
import { PrintFeatureBlock } from '../PrintFeature/PrintFeature.block';

class EditFeatureActionsBlock extends Block {
  selectors = {
    root: '.EditFeatureActions',
    printFeature: '.PrintFeature'
  };

  async clickPrintAction(): Promise<void> {
    const $printFeature = await this.findBySelector('printFeature');
    const printFeatureBlock = new PrintFeatureBlock(null, $printFeature);
    await printFeatureBlock.click();
  }
}

export const editFeatureActionsBlock = new EditFeatureActionsBlock();
