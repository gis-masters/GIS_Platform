import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';
import { LibraryRecord } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { requestAsAdmin } from '../requestAs';

export function updateLibraryRecord(
  libraryTableName: string,
  recordId: number,
  patch: Partial<LibraryRecord>
): Promise<void> {
  return requestAsAdmin(docLibraryClient.updateLibraryRecord, libraryTableName, recordId, patch);
}
