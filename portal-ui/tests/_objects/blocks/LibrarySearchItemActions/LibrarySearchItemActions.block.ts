import { Block } from '../../Block';

class LibrarySearchItemActionsBlock extends Block {
  selectors = {
    root: '.LibrarySearchItemActions',
    open: '.LibrarySearchItemActions-Open'
  };

  async clickOpenButton(): Promise<void> {
    const $open = await this.findBySelector('open');
    await $open.waitForClickable();
    await $open.click();
  }
}

export const librarySearchItemActionsBlock = new LibrarySearchItemActionsBlock();
