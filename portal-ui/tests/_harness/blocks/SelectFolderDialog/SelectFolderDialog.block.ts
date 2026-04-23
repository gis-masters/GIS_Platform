import { Block } from '../../classes/Block';
import { DialogBlock } from '../Dialog/Dialog.block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class SelectFolderDialogBlock extends Block {
  selectors = {
    root: '.SelectFolderDialog',
    loader: '.SelectFolderDialog .Loading'
  };

  async selectFolder(explorerItemTitle: string): Promise<void> {
    await this.waitForVisible();
    await this.waitForLoading();
    const explorerBlock = new ExplorerBlock(await this.findBySelector('root'));
    await explorerBlock.selectExplorerItem(explorerItemTitle);

    const dialogBlock = new DialogBlock(null, await this.findBySelector('root'));
    await dialogBlock.clickPrimaryActionButton();
    await dialogBlock.waitForHidden();
  }

  async openExplorerItem(item: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();

    await explorerBlock.openExplorerItem(item);
  }
}

export const selectFolderDialogBlock = new SelectFolderDialogBlock();
