import { Page } from '../Page';

export class LibraryRegistryPage extends Page {
  selectors = {
    container: '.LibraryRegistry'
  };
  title = 'Табличный вид библиотеки документов';
  url: string;

  deletedDocumentsLibraryUrl = '?filter=%7B%22is_deleted%22%3Atrue%7D';

  constructor(libraryTableName: string) {
    super();
    this.url = `/data-management/library/${libraryTableName}/registry`;
  }

  async openDeletedLibraryRegistryPage(): Promise<void> {
    await browser.url(this.url + this.deletedDocumentsLibraryUrl);
  }
}
