import { assert } from 'chai';

import { Block } from './Block';

export class Page extends Block {
  url = '';

  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  async testUrl(): Promise<void> {
    const url = await this.browser.getUrl();

    return assert.include(url, this.url, 'Некорректный url');
  }

  open(): Promise<string> {
    return this.browser.url(this.url);
  }
}
