import { WdioCheckElementMethodOptions } from 'wdio-image-comparison-service';

import { Block } from '../../Block';

class PermissionsWidgetBlock extends Block {
  selectors = {
    container: '.PermissionsWidget',
    openBtn: '.PermissionsWidget-Open',
    content: '.PermissionsWidget-Content'
  };

  async clickOpenBtn(): Promise<void> {
    await this.waitForVisible();

    const $openBtn = await this.$('openBtn');
    await $openBtn.waitForClickable();
    await $openBtn.click();
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const permissionsWidgetBlock = new PermissionsWidgetBlock();
