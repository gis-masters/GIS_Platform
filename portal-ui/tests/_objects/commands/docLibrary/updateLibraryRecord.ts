import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';
import { LibraryRecord } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { requestAsAdmin } from '../requestAs';

export async function updateLibraryRecord(
  libraryTableName: string,
  recordId: number,
  patch: Partial<LibraryRecord>
): Promise<void> {
  await requestAsAdmin(docLibraryClient.updateLibraryRecord, libraryTableName, recordId, patch);
}
