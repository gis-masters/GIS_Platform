import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { requestAsAdmin } from '../requestAs';

export async function deleteLibraryRecord(libraryTableName: string, recordId: number): Promise<void> {
  await requestAsAdmin(libraryClient.deleteLibraryRecord, recordId, libraryTableName);
}
