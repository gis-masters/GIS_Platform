import { Block } from '../../Block';
import { CopyFeaturesButtonBlock } from '../CopyFeaturesButton/CopyFeaturesButton.block';

class EditFeatureSidebarBlock extends Block {
  selectors = {
    container: '.edit-features-sidebar'
  };

  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.container);
}

export const editFeatureSidebarBlock = new EditFeatureSidebarBlock();
