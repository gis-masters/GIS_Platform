import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';
import { LibraryRecord, LibraryRecordNew } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { requestAs, requestAsAdmin } from '../requestAs';
import { TestUser } from '../auth/testUsers';

export async function createLibraryRecordAs(
  data: LibraryRecordNew,
  libraryTableName: string,
  user: TestUser
): Promise<LibraryRecord> {
  return await requestAs(user, docLibraryClient.createLibraryRecord, data, libraryTableName);
}

export async function createLibraryRecordAsAdmin(
  data: LibraryRecordNew,
  libraryTableName: string
): Promise<LibraryRecord> {
  return await requestAsAdmin(docLibraryClient.createLibraryRecord, data, libraryTableName);
}
