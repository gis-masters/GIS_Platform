import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { LibraryRecord } from '../../../../src/app/services/data/library/library.models';
import { requestAsAdmin } from '../requestAs';

export async function moveLibraryRecord(
  libraryTableName: string,
  record: LibraryRecord,
  target: LibraryRecord
): Promise<void> {
  if (target.path && target.id && record.id) {
    await requestAsAdmin(libraryClient.moveLibraryRecord, libraryTableName, record.id, target.id);
  }
}
