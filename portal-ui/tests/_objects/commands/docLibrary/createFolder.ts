import { Library, LibraryRecord, LibraryRecordNew } from '../../../../src/app/services/data/library/library.models';
import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { requestAsAdmin } from '../requestAs';

export async function createFolder(
  library: Library,
  title: string,
  contentTypeId: string,
  path = '/root'
): Promise<LibraryRecord> {
  const record: LibraryRecordNew = {
    title,
    content_type_id: contentTypeId,
    path
  };

  return await requestAsAdmin(libraryClient.createLibraryRecord, record, library.table_name);
}
