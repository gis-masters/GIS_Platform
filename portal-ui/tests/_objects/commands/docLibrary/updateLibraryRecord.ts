import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { LibraryRecord } from '../../../../src/app/services/data/library/library.models';
import { requestAsAdmin } from '../requestAs';

export async function updateLibraryRecord(
  libraryTableName: string,
  recordId: number,
  patch: Partial<LibraryRecord>
): Promise<void> {
  await requestAsAdmin(libraryClient.updateLibraryRecord, libraryTableName, recordId, patch);
}
