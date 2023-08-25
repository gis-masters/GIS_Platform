import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';
import { DocumentLibrary } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { requestAsAdmin } from '../requestAs';

export async function getDocumentsLibraryByTitle(title: string): Promise<DocumentLibrary> {
  const response = await requestAsAdmin(docLibraryClient.getLibraries, { pageSize: 2, page: 0, filter: { title } });

  if (response.content?.length !== 1) {
    throw new Error(`Ошибка получения библиотеки документов "${title}"`);
  }

  return response.content[0];
}
