import { assert } from 'chai';

import { Block } from './Block';

declare const window: { navigate(url: string): void };

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

  navigate(urlExtras: string = ''): Promise<void> {
    return this.browser.execute(url => {
      window.navigate(url);
    }, this.url + urlExtras);
  }
}
