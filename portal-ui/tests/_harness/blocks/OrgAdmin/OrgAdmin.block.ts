import { Block } from '../../classes/Block';

class OrgAdminBlock extends Block {
  selectors = {
    root: '.OrgAdmin',
    loader: '.OrgAdmin .Loading'
  };
}

export const orgAdminBlock = new OrgAdminBlock();
