import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { Library } from '../../../../src/app/services/data/library/library.models';
import { convertOldToNewSchema } from '../../../../src/app/services/data/schema/schema.utils';
import { requestAsAdmin } from '../requestAs';

export async function getDocumentsLibraryByTitle(title: string): Promise<Library> {
  const response = await requestAsAdmin(libraryClient.getLibraries, { pageSize: 2, page: 0, filter: { title } });

  if (response.content?.length !== 1) {
    throw new Error(`Ошибка получения библиотеки документов "${title}"`);
  }

  return { ...response.content[0], schema: convertOldToNewSchema(response.content[0].schema) };
}
