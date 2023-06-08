import { LibraryRecord } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { requestAsAdmin } from '../requestAs';
import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';

export async function moveLibraryRecord(
  libraryTableName: string,
  record: LibraryRecord,
  target: LibraryRecord
): Promise<void> {
  if (target.path && target.id && record.id) {
    await requestAsAdmin(docLibraryClient.moveLibraryRecord, libraryTableName, record.id, target.id);
  }
}
