import { Block } from '../../classes/Block';
import { DialogBlock } from '../Dialog/Dialog.block';
import { printMapDialogPreviewBlock } from './Preview/PrintMapDialog-Preview.block';

export class PrintMapDialogBlock extends Block {
  selectors = {
    root: '.PrintMapDialog'
  };

  async waitForPreviewReady(): Promise<void> {
    await printMapDialogPreviewBlock.waitForPreviewReady();
  }

  async clickPrimaryAction(): Promise<void> {
    const $paper = await this.findBySelector('root');
    const dialogBlock = new DialogBlock(null, $paper);
    await dialogBlock.clickPrimaryActionButton();
  }
}

export const printMapDialogBlock = new PrintMapDialogBlock();
