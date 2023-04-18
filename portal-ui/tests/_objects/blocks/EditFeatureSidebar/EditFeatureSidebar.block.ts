import { Block } from '../../Block';

class EditFeatureSidebarBlock extends Block {
  selectors = {
    container: '.edit-features-sidebar'
  };
}

export const editFeatureSidebarBlock = new EditFeatureSidebarBlock();
