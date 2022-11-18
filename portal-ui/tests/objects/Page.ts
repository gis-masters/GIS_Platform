import { Block, BlockModel } from './Block';

declare const window: { navigate(url: string): void };

export interface PageModel extends BlockModel {
  url: string;
}

export abstract class Page extends Block {
  url?: string;

  async testUrl(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/await-thenable -- типы врут
    await expect(browser).toHaveUrlContaining(this.url);
  }

  async open(): Promise<void> {
    await browser.url(this.url);
    await this.waitForVisible();
  }

  navigate(urlExtras = ''): Promise<void> {
    return browser.execute(url => {
      window.navigate(url);
    }, this.url + urlExtras);
  }
}
