import { Page } from '../Page';

export class LibraryRegistryPage extends Page {
  selectors = {
    container: '.LibraryRegistry'
  };
  title = 'Табличный вид библиотеки документов';
  url: string;

  constructor(libraryTableName: string) {
    super(true);
    this.url = `/data-management/library/${libraryTableName}/registry`;
  }
}
