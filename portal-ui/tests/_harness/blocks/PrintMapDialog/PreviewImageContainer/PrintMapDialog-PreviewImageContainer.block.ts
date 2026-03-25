import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../../classes/Block';

export class PrintMapDialogPreviewImageContainerBlock extends Block {
  selectors = {
    root: '.PrintMapDialog-PreviewImageContainer',
    printDialogDate: '.PrintMapDialog-Date'
  };

  async assertSelfie(tag?: string, checkElementOptions: WdioCheckElementMethodOptions = {}): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await browser.waitUntil(async () => {
      const { height } = await $root.getSize();

      return height > 0;
    });

    await super.assertSelfie(tag, {
      ...checkElementOptions,
      hideElements: [await this.findBySelector('printDialogDate'), ...(checkElementOptions.hideElements ?? [])]
    });
  }
}

export const printMapDialogPreviewImageContainerBlock = new PrintMapDialogPreviewImageContainerBlock();
