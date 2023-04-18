import { Block } from './Block';

declare const window: { navigate(url: string): void };

export const pagesRegistry: Record<string, Page> = {};

export abstract class Page extends Block {
  abstract url: string;
  abstract title: string;

  constructor(isPageNotGoInRegistry = false) {
    super();
    if (!isPageNotGoInRegistry) {
      pagesRegistry[this.constructor.name] = this;
    }
  }

  async testUrl(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-call -- типы врут
    await expect(browser).toHaveUrlContaining(this.url);
  }

  async open(urlExtras = ''): Promise<void> {
    await browser.url(this.url + urlExtras);
    await this.waitForVisible();
  }

  // перейти на данную страницу с другой страницы приложения, используя роутер приложения
  navigate(urlExtras = ''): Promise<void> {
    return browser.execute(url => {
      window.navigate(url);
    }, this.url + urlExtras);
  }
}
