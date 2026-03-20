import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../classes/Block';

class PermissionsWidgetBlock extends Block {
  selectors = {
    root: '.PermissionsWidget',
    openBtn: '.PermissionsWidget-Open',
    content: '.PermissionsWidget-Content'
  };

  async clickOpenBtn(): Promise<void> {
    await this.waitForVisible();

    const $openBtn = await this.findBySelector('openBtn');
    await $openBtn.waitForClickable();
    await $openBtn.click();
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const permissionsWidgetBlock = new PermissionsWidgetBlock();
