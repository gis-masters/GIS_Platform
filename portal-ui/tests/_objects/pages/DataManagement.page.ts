import { breadcrumbsBlock } from '../blocks/Breadcrumbs/Breadcrumbs.block';
import { Page } from '../Page';

class DataManagementPage extends Page {
  title = 'Управление данными';
  url = 'data-management';

  libraryRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22lr%22,%22libraryRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22title%22,%22asc%22,%7B%7D%5D';
  datasetRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22dr%22,%22datasetRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22created_at%22,%22desc%22,%7B%7D%5D';

  selectors = {
    container: '.DataManagement'
  };

  async openLibraryRootPage() {
    await browser.url(this.url + this.libraryRootUrl);
  }

  async openDatasetRootPage() {
    await browser.url(this.url + this.datasetRootUrl);
  }

  async testLibraryRootPage() {
    await this.waitForVisible();
    // eslint-disable-next-line @typescript-eslint/await-thenable -- типы врут
    await expect(browser).toHaveUrlContaining(this.libraryRootUrl);
    const texts = await breadcrumbsBlock.getItemsText();
    expect(texts.at(-1)).toBe('Библиотеки документов');
  }
}

export const dataManagementPage = new DataManagementPage();
