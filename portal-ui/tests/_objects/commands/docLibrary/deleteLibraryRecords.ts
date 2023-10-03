import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { getDocumentsLibraryByTitle } from './getDocLibraryByTitle';
import { requestAsAdmin } from '../requestAs';

export async function deleteAllLibraryRecordInLibrary(libraryTitle: string): Promise<void> {
  const library = await getDocumentsLibraryByTitle(libraryTitle);
  const response = await requestAsAdmin(libraryClient.getAllLibraryRecords, library.table_name);

  if (response) {
    for (const record of response) {
      await requestAsAdmin(libraryClient.deleteLibraryRecord, record.content.id, library.table_name);
    }
  }
}
