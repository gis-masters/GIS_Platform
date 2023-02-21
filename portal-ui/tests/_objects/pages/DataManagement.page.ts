import { binding, given, then, when } from 'cucumber-tsflow/dist';

import { Page } from '../Page';
import { breadcrumbs } from '../blocks/Breadcrumbs/Breadcrumbs.block';

@binding()
class DataManagementPage extends Page {
  title = 'Управление данными';
  url = 'data-management';

  libraryRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22lr%22,%22libraryRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22title%22,%22asc%22,%7B%7D%5D';
  datasetRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22dr%22,%22datasetRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22created_at%22,%22desc%22,%7B%7D%5D';

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

  @when(/^я открываю страницу `Наборы данных` в управлении данными$/)
  async openDatasetRootPage() {
    await browser.url(this.url + this.datasetRootUrl);
  }

  @given(/^я на странице `Наборы данных` в управлении данными$/)
  async datasetRootPageOpened() {
    await browser.url(this.url + this.datasetRootUrl);
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
