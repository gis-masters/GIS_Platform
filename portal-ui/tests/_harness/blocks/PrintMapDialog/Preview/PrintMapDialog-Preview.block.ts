import { Block } from '../../../classes/Block';

export class PrintMapDialogPreviewBlock extends Block {
  selectors = {
    root: '.PrintMapDialog-Preview',
    loader: '.PrintMapDialog-Preview .MuiPaper-root > .Loading',
    previewImage: '.PrintMapDialog-PreviewImage'
  };

  async waitForPreviewReady(): Promise<void> {
    await this.waitForLoading();
    const $img = await this.findBySelector('previewImage');
    await $img.waitForDisplayed();
  }
}

export const printMapDialogPreviewBlock = new PrintMapDialogPreviewBlock();
