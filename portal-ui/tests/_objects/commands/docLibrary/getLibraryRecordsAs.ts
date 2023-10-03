import { getLibraryRecords } from '../../../../src/app/services/data/library/library.service';
import { LibraryRecord } from '../../../../src/app/services/data/library/library.models';
import { PageOptions } from '../../../../src/app/services/models';
import { TestUser } from '../auth/testUsers';
import { authenticateAs } from '../auth/authenticate';

declare const window: {
  getLibraryRecords: typeof getLibraryRecords;
};

export async function getLibraryRecordsAs(
  libraryTableName: string,
  schemaId: string,
  pageOptions: PageOptions,
  user: TestUser
): Promise<[LibraryRecord[], number]> {
  await authenticateAs(user);

  const { result, ok } = await browser.executeAsync<{ result: string; ok: boolean }, [string, string, string]>(
    async (libraryTableName, schemaId, pageOptionsSerialized, callback) => {
      try {
        const pageOptions = JSON.parse(pageOptionsSerialized) as PageOptions;
        const result = await window.getLibraryRecords(libraryTableName, schemaId, pageOptions);
        callback({ result: JSON.stringify(result), ok: true });
      } catch {
        callback({ result: '', ok: false });
      }
    },
    libraryTableName,
    schemaId,
    JSON.stringify(pageOptions)
  );

  if (!ok) {
    throw new Error(`Не удалось получить записи библиотеки "${libraryTableName}"`);
  }

  return JSON.parse(result) as [LibraryRecord[], number];
}
