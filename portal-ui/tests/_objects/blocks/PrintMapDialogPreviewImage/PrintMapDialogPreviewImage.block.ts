import { WdioCheckElementMethodOptions } from 'wdio-image-comparison-service';

import { Block } from '../../Block';

class PrintMapDialogPreviewImageBlock extends Block {
  selectors = {
    container: '.PrintMapDialog-PreviewImageContainer',
    printDialogDate: '.PrintMapDialog .PrintMapDialog-Date'
  };

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [await this.$('printDialogDate'), ...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const printMapDialogPreviewImageBlock = new PrintMapDialogPreviewImageBlock();
