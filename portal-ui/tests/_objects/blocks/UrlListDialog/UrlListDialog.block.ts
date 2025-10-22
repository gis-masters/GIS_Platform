import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';

class UrlListDialogBlock extends Block {
  selectors = {
    container: '.UrlsList-Dialog'
  };

  async assertSelfie(tag = 'plain', checkElementOptions: WdioCheckElementMethodOptions = {}): Promise<void> {
    await this.waitForVisible();
    await sleep(300); // анимация открытия диалога
    await super.assertSelfie(tag, checkElementOptions);
  }
}

export const urlListDialogBlock = new UrlListDialogBlock();
