import { Block } from '../../Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class SelectFolderDialogBlock extends Block {
  selectors = {
    container: '.SelectFolderDialog',
    select: '.SelectFolderDialog .MuiButton-outlinedPrimary',
    loading: '.SelectFolderDialog .Loading'
  };

  async selectFolder(): Promise<void> {
    await this.waitForVisible();

    const $loading = await this.$('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForDisplayed({ reverse: true });
    const $select = await this.$('select');
    await $select.waitForClickable();
    await $select.click();
    await $select.waitForDisplayed({ reverse: true });
  }

  async openExplorerItem(item: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();

    await explorerBlock.openExplorerItem(item);
  }
}

export const selectFolderDialogBlock = new SelectFolderDialogBlock();
