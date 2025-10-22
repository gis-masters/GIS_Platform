import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../Block';

class PermissionsWidgetBlock extends Block {
  selectors = {
    container: '.PermissionsWidget',
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
    const $container = await this.findBySelector('container');
    await $container.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const permissionsWidgetBlock = new PermissionsWidgetBlock();
