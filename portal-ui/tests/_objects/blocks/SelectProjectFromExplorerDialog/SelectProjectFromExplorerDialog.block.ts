import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class SelectProjectFromExplorerDialogBlock extends Block {
  selectors = {
    root: '.SelectProjectFromExplorerDialog',
    select: '.SelectProjectFromExplorerDialog .MuiButton-outlinedPrimary',
    loading: '.SelectProjectFromExplorerDialog .Loading'
  };

  async selectFolder(explorerItemTitle: string): Promise<void> {
    await this.waitForVisible();
    await this.loading();

    const explorerBlock = new ExplorerBlock(await this.findBySelector('root'));
    await explorerBlock.selectExplorerItem(explorerItemTitle);
  }

  async loading(): Promise<void> {
    const $loading = await this.findBySelector('loading');
    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForExist({ reverse: true });
  }

  async saveSelectedFolder(): Promise<void> {
    await this.loading();

    const $select = await this.findBySelector('select');
    await $select.waitForClickable();

    await $select.click();
    await $select.waitForExist({ reverse: true });
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }

  async allItemsIsDisabled(): Promise<boolean> {
    const explorerBlock = new ExplorerBlock(await this.findBySelector('root'));

    return await explorerBlock.allItemsIsDisabled();
  }
}

export const selectProjectFromExplorerDialogBlock = new SelectProjectFromExplorerDialogBlock();
