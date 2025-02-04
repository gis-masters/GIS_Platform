import { breadcrumbsBlock } from '../blocks/Breadcrumbs/Breadcrumbs.block';
import { Page } from '../Page';

class DataManagementPage extends Page {
  title = 'Управление данными';
  url = 'data-management';

  libraryRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22lr%22,%22libraryRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22title%22,%22asc%22,%7B%7D%5D';
  datasetRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22dr%22,%22datasetRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22created_at%22,%22desc%22,%7B%7D%5D';
  projectRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22pr%22,%22projectsRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22created_at%22,%22desc%22,%7B%7D%5D';
  schemasRootUrl =
    '?path_dm=%5B%22r%22,%22root%22,%22sr%22,%22schemasRoot%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22created_at%22,%22desc%22,%7B%7D%5D';

  selectors = {
    container: '.DataManagement'
  };

  async openLibraryRootPage() {
    await browser.url(this.url + this.libraryRootUrl);
  }

  async openLibraryPage(library: string) {
    const libraryUrl = `?path_dm=%5B%22r%22,%22root%22,%22lr%22,%22libraryRoot%22,%22lib%22,%22${library}%22,%22none%22,%22none%22%5D&opts_dm=%5B0,10,%22title%22,%22asc%22,%7B%7D%5D`;

    await browser.url(this.url + libraryUrl);
  }

  async openDatasetRootPage() {
    await browser.url(this.url + this.datasetRootUrl);
  }

  async openProjectRootPage() {
    await browser.url(this.url + this.projectRootUrl);
  }

  async openSchemasRootPage() {
    await browser.url(this.url + this.schemasRootUrl);
  }

  async openSchemaPageWithSelectedSchema(schemaName: string) {
    const schemaUrl = `?path_dm=%5B%22r%22,%22root%22,%22sr%22,%22schemasRoot%22,%22schema%22,%22${schemaName}%22%5D&opts_dm=%5B0,10,%22created_at%22,%22desc%22,%7B%7D%5D`;
    await browser.url(this.url + schemaUrl);
  }

  async testLibraryRootPage() {
    await this.waitForVisible();
    await expect(browser).toHaveUrlContaining(this.libraryRootUrl);
    await breadcrumbsBlock.waitForVisible();
    const texts = await breadcrumbsBlock.getItemsText();
    await expect(texts.at(-1)).toBe('Библиотеки документов');
  }
}

export const dataManagementPage = new DataManagementPage();
