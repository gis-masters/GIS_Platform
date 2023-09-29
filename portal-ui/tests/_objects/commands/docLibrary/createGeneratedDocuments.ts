import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { applyContentType } from '../../../../src/app/services/data/schema/schema.utils';
import { DocumentLibrary, LibraryRecord } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { getSchema } from '../schemas/getSchema';
import { generateObjectBySchema, supportedTypesForGeneration } from '../../utils/generateObjectBySchema';
import { createLibraryRecordAs } from './createLibraryRecordAs';
import { TestUser } from '../auth/testUsers';

export async function createGeneratedDocuments(
  docsNumber: number,
  library: DocumentLibrary,
  user: TestUser
): Promise<LibraryRecord[]> {
  const schema = await getSchema(library.schemaId);
  const schemasWithContentTypes: Schema[] =
    schema.contentTypes
      ?.map(({ id }) => applyContentType(schema, id))
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
    const record = await createLibraryRecordAs(generateObjectBySchema(selectedSchema), library.table_name, user);
    record.libraryTableName = record.libraryTableName || library.table_name;
    created.push(record);
  }

  return created;
}
