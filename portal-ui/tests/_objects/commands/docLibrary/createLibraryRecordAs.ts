import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { LibraryRecord, LibraryRecordNew } from '../../../../src/app/services/data/library/library.models';
import { requestAs, requestAsAdmin } from '../requestAs';
import { TestUser } from '../auth/testUsers';

export async function createLibraryRecordAs(
  data: LibraryRecordNew,
  libraryTableName: string,
  user: TestUser
): Promise<LibraryRecord> {
  return await requestAs(user, libraryClient.createLibraryRecord, data, libraryTableName);
}

export async function createLibraryRecordAsAdmin(
  data: LibraryRecordNew,
  libraryTableName: string
): Promise<LibraryRecord> {
  return await requestAsAdmin(libraryClient.createLibraryRecord, data, libraryTableName);
}
