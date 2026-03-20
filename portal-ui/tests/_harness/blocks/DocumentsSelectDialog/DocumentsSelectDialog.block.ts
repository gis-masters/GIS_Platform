import { Block } from '../../classes/Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class DocumentsSelectDialogBlock extends Block {
  selectors = {
    root: '.DocumentsSelectDialog',
    switcher: '.DocumentsSelectDialog .DocumentsSelectDialog-Switcher button',
    select: '.DocumentsSelectDialog .MuiButton-outlinedPrimary'
  };

  async openLibrary(title: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForExist();
    await explorerBlock.openExplorerItem(title);
  }

  async switchExplorerView(): Promise<void> {
    const $switcher = await this.findBySelector('switcher');
    await $switcher.waitForDisplayed();
    await $switcher.click();
  }

  async select(): Promise<void> {
    const $select = await this.findBySelector('select');
    await $select.waitForDisplayed();
    await $select.click();
    await $select.waitForExist({ reverse: true });
  }
}

export const documentsSelectDialogBlock = new DocumentsSelectDialogBlock();
