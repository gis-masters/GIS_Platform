import { Block } from './Block';

declare const window: { navigate(url: string): void };

export abstract class Page extends Block {
  abstract url: string;
  abstract title: string;

  async testUrl(): Promise<void> {
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
