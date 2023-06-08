import {
  DocumentLibrary,
  LibraryRecord,
  LibraryRecordNew
} from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';
import { requestAsAdmin } from '../requestAs';

export async function createFolder(
  library: DocumentLibrary,
  title: string,
  contentTypeId: string,
  path = '/root'
): Promise<LibraryRecord> {
  const record: LibraryRecordNew = {
    title,
    content_type_id: contentTypeId,
    path
  };

  return await requestAsAdmin(docLibraryClient.createLibraryRecord, record, library.table_name);
}
