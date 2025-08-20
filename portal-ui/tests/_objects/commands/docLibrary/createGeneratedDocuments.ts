import { Library, LibraryRecord } from '../../../../src/app/services/data/library/library.models';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { applyContentType } from '../../../../src/app/services/data/schema/schema.utils';
import { generateObjectBySchema, supportedTypesForGeneration } from '../../utils/generateObjectBySchema';
import { TestUser } from '../auth/testUsers';
import { createLibraryRecordAs } from './createLibraryRecordAs';

export async function createGeneratedDocuments(
  docsNumber: number,
  library: Library,
  user: TestUser
): Promise<LibraryRecord[]> {
  const schemasWithContentTypes: Schema[] =
    library.schema.contentTypes
      ?.map(({ id }) => applyContentType(library.schema, id))
      .filter(({ properties }) =>
        properties.every(
          ({ propertyType, required }) => !required || supportedTypesForGeneration.includes(propertyType)
        )
      ) || [];

  if (!schemasWithContentTypes.length) {
    throw new Error(`В схеме библиотеки "${library.title}" нет подходящих типов документа`);
  }

  const created: LibraryRecord[] = [];

  for (let i = 0; i < docsNumber; i++) {
    const selectedSchema = schemasWithContentTypes[Math.floor(Math.random() * 3)] || schemasWithContentTypes[0];
    const record = await createLibraryRecordAs(generateObjectBySchema(selectedSchema, i), library.table_name, user);
    created.push({
      ...record,
      libraryTableName: library.table_name
    });
  }

  return created;
}
