import { WdioCheckElementMethodOptions } from 'wdio-image-comparison-service';

import { Block } from '../../Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class SelectProjectFromExplorerDialogBlock extends Block {
  selectors = {
    container: '.SelectProjectFromExplorerDialog',
    select: '.SelectProjectFromExplorerDialog .MuiButton-outlinedPrimary',
    loading: '.SelectProjectFromExplorerDialog .Loading'
  };

  async selectFolder(explorerItemTitle: string): Promise<void> {
    await this.waitForVisible();
    await this.loading();

    const explorerBlock = new ExplorerBlock(await this.$('container'));
    await explorerBlock.selectExplorerItem(explorerItemTitle);
  }

  async loading(): Promise<void> {
    const $loading = await this.$('loading');
    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForDisplayed({ reverse: true });
  }

  async saveSelectedFolder(): Promise<void> {
    await this.loading();

    const $select = await this.$('select');
    await $select.waitForClickable();

    await $select.click();
    await $select.waitForDisplayed({ reverse: true });
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }

  async allItemsIsDisabled(): Promise<boolean> {
    const explorerBlock = new ExplorerBlock(await this.$('container'));

    return await explorerBlock.allItemsIsDisabled();
  }
}

export const selectProjectFromExplorerDialogBlock = new SelectProjectFromExplorerDialogBlock();
