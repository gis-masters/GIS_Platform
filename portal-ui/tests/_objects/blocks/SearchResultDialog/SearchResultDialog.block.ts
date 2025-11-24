import { Block } from '../../Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { librarySearchItemActionsBlock } from '../LibrarySearchItemActions/LibrarySearchItemActions.block';

class SearchResultDialogBlock extends Block {
  selectors = {
    root: '.SearchResultDialog'
  };

  async openItem(): Promise<void> {
    await librarySearchItemActionsBlock.clickOpenButton();
  }

  async selectItem(title: string): Promise<void> {
    await this.waitForVisible();

    const $explorerBlock = new ExplorerBlock(await this.findBySelector('root'));
    await $explorerBlock.waitForLoading();
    await $explorerBlock.selectExplorerItem(title);
  }
}

export const searchResultDialogBlock = new SearchResultDialogBlock();
