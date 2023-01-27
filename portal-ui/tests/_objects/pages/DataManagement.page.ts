import { binding, then, when } from 'cucumber-tsflow/dist';
import { breadcrumbs } from '../blocks/Breadcrumbs/Breadcrumbs.block';
import { Page } from '../Page';

@binding()
class DataManagementPage extends Page {
  url = 'data-management';
  libraryRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22lr%22,%22libraryRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22title%22,%22asc%22,%7B%7D%5D';

  get $container(): Promise<WebdriverIO.Element> {
    return $('.DataManagement');
  }

  get $explorer(): Promise<WebdriverIO.Element> {
    return $('.DataManagement .Explorer');
  }

  @when(/^я открываю страницу библиотек в управлении данными$/)
  async openLibraryRootPage() {
    await browser.url(this.url + this.libraryRootUrl);
  }

  @when(/^дожидаюсь появления explorer$/)
  async waitForExplorer() {
    const $explorer = await this.$explorer;
    await $explorer.waitForDisplayed({ timeout: 5000 });
  }

  @then(/^открыта страница библиотек в управлении данными$/)
  async testLibraryRootPage() {
    await browser.url(this.url + this.libraryRootUrl);
    await this.waitForVisible();
    // eslint-disable-next-line @typescript-eslint/await-thenable -- типы врут
    await expect(browser).toHaveUrlContaining(this.libraryRootUrl);
    const texts = await breadcrumbs.getItemsText();
    expect(texts.at(-1)).toBe('Библиотеки документов');
  }
}

export const dataManagementPage = new DataManagementPage();
