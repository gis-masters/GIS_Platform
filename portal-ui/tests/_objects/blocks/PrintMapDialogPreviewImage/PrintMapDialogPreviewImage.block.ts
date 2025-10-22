import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../Block';

class PrintMapDialogPreviewImageBlock extends Block {
  selectors = {
    container: '.PrintMapDialog-PreviewImageContainer',
    printDialogDate: '.PrintMapDialog .PrintMapDialog-Date'
  };

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $container = await this.findBySelector('container');
    await $container.waitForDisplayed();

    await browser.waitUntil(async () => {
      const { height } = await $container.getSize();

      return height > 0;
    });

    await super.assertSelfie(tag, {
      hideElements: [await this.findBySelector('printDialogDate'), ...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const printMapDialogPreviewImageBlock = new PrintMapDialogPreviewImageBlock();
