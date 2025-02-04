import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { LibraryRecord } from '../../../../src/app/services/data/library/library.models';
import { PageOptions } from '../../../../src/app/services/models';
import { requestAsAdmin } from '../requestAs';

export async function getLibraryRecords(
  libraryTableName: string,
  pageOptions: PageOptions
): Promise<[LibraryRecord[], number]> {
  const response = await requestAsAdmin(libraryClient.getLibraryRecordsAsRegistry, libraryTableName, pageOptions);

  return [response.content.map(item => ({ ...item.content, libraryTableName })), response.page.totalPages];
}
