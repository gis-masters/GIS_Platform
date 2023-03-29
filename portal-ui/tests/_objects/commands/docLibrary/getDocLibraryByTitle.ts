import { DocumentLibrary } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { getLibraries } from '../../../../src/app/services/data/docLibrary/docLibrary.service';

declare const window: {
  getLibraries: typeof getLibraries;
};

export async function getDocumentsLibraryByTitle(title: string): Promise<DocumentLibrary> {
  const serializedLibraries = await browser.executeAsync<string, [string]>(async (title, callback) => {
    const [foundLibraries] = await window.getLibraries({ page: 0, pageSize: 2, filter: { title } });

    callback(JSON.stringify(foundLibraries));
  }, title);

  const libraries = JSON.parse(serializedLibraries) as DocumentLibrary[];

  if (libraries.length !== 1) {
    throw new Error(`Ошибка получения библиотеки документов "${title}"`);
  }

  return libraries[0];
}
