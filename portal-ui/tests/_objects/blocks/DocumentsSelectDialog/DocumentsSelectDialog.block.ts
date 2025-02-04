import { Block } from '../../Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class DocumentsSelectDialogBlock extends Block {
  selectors = {
    container: '.DocumentsSelectDialog',
    switcher: '.DocumentsSelectDialog .DocumentsSelectDialog-Switcher button',
    select: '.DocumentsSelectDialog .MuiButton-outlinedPrimary'
  };

  async openLibrary(title: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForExist();
    await explorerBlock.openExplorerItem(title);
  }

  async switchExplorerView(): Promise<void> {
    const $switcher = await this.$('switcher');
    await $switcher.waitForDisplayed();
    await $switcher.click();
  }

  async select(): Promise<void> {
    const $select = await this.$('select');
    await $select.waitForDisplayed();
    await $select.click();
    await $select.waitForDisplayed({ reverse: true });
  }
}

export const documentsSelectDialogBlock = new DocumentsSelectDialogBlock();
