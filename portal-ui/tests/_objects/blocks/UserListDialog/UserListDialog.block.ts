import { Block } from '../../Block';

class UserListDialogBlock extends Block {
  selectors = {
    container: '.Users-AddDialog'
  };
}

export const userListDialogBlock = new UserListDialogBlock();
