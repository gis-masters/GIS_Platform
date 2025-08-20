import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { requestAsAdmin } from '../requestAs';
import { getDocumentsLibraryByTitle } from './getDocLibraryByTitle';

export async function deleteAllLibraryRecordInLibrary(libraryTitle: string): Promise<void> {
  const library = await getDocumentsLibraryByTitle(libraryTitle);
  const response = await requestAsAdmin(libraryClient.getAllLibraryRecords, library.table_name);

  if (response) {
    response.sort((a, b) => b.content.path.split('/').length - a.content.path.split('/').length);

    for (const record of response) {
      await requestAsAdmin(libraryClient.deleteLibraryRecord, record.content.id, library.table_name);
    }
  }
}
