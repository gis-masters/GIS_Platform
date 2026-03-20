import { Block } from '../../classes/Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class SelectFolderDialogBlock extends Block {
  selectors = {
    root: '.SelectFolderDialog',
    select: '.SelectFolderDialog .MuiButton-outlinedPrimary',
    loading: '.SelectFolderDialog .Loading'
  };

  async selectFolder(explorerItemTitle: string): Promise<void> {
    await this.waitForVisible();

    const $loading = await this.findBySelector('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForExist({ reverse: true });
    const explorerBlock = new ExplorerBlock(await this.findBySelector('root'));
    await explorerBlock.selectExplorerItem(explorerItemTitle);

    const $select = await this.findBySelector('select');
    await $select.waitForClickable();
    await $select.click();
    await $select.waitForExist({ reverse: true });
  }

  async openExplorerItem(item: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();

    await explorerBlock.openExplorerItem(item);
  }
}

export const selectFolderDialogBlock = new SelectFolderDialogBlock();
