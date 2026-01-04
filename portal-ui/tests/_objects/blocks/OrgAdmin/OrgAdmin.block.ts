import { Block } from '../../Block';

class OrgAdminBlock extends Block {
  selectors = {
    root: '.OrgAdmin',
    loader: '.OrgAdmin .Loading'
  };
}

export const orgAdminBlock = new OrgAdminBlock();
