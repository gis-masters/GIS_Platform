import { LibraryRecord, LibraryRecordRaw } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { createLibraryRecord } from '../../../../src/app/services/data/docLibrary/docLibrary.service';
import { authenticateAs } from '../auth/authenticate';
import { TestUser } from '../auth/testUsers';

declare const window: {
  createLibraryRecord: typeof createLibraryRecord;
};

export async function createLibraryRecordAs(
  data: LibraryRecordRaw,
  libraryTableName: string,
  schemaId: string,
  user: TestUser
): Promise<LibraryRecord> {
  await authenticateAs(user);

  const { created, ok } = await browser.executeAsync<{ created: string; ok: boolean }, [string, string, string]>(
    async (dataSerialized, libraryTableName, schemaId, callback) => {
      try {
        const result = await window.createLibraryRecord(
          JSON.parse(dataSerialized) as LibraryRecordRaw,
          libraryTableName,
          schemaId
        );
        callback({ created: JSON.stringify(result), ok: true });
      } catch {
        callback({ created: '', ok: false });
      }
    },
    JSON.stringify(data),
    libraryTableName,
    schemaId
  );

  if (!ok) {
    throw new Error('Не удалось создать документ');
  }

  return JSON.parse(created) as LibraryRecord;
}
