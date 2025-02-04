import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { LibraryRecordNew, LibraryRecordRaw } from '../../../../src/app/services/data/library/library.models';
import { TestUser } from '../auth/testUsers';
import { requestAs, requestAsAdmin } from '../requestAs';

export async function createLibraryRecordAs(
  data: LibraryRecordNew,
  libraryTableName: string,
  user: TestUser
): Promise<LibraryRecordRaw> {
  return await requestAs(user, libraryClient.createLibraryRecord, data, libraryTableName);
}

export async function createLibraryRecordAsAdmin(
  data: LibraryRecordNew,
  libraryTableName: string
): Promise<LibraryRecordRaw> {
  return await requestAsAdmin(libraryClient.createLibraryRecord, data, libraryTableName);
}
