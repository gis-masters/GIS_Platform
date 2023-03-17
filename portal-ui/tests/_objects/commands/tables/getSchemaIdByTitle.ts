import { testSchemas } from '../schemas/testSchemas';

export function getSchemaIdByTitle(schemaTitle: string): string {
  const schema = testSchemas[schemaTitle];
  if (!schema) {
    throw new Error(`Used unknown schema: '${schemaTitle}'! Add it to tests schemas first.`);
  }

  const schemaId = schema.name;
  if (!schemaId) {
    throw new Error(`Incorrect schema: ${schema.toString()}`);
  }

  return schemaId;
}
