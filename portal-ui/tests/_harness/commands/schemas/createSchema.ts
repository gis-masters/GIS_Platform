import { schemaClient } from '../../../../src/app/services/data/schema/schema.client';
import { type Schema } from '../../../../src/app/services/data/schema/schema.models';
import { convertNewToOldSchema } from '../../../../src/app/services/data/schema/utils/convertNewToOldSchema';
import { requestAsAdmin } from '../requestAs';
import { getSchemaTemplate } from './getSchemaTemplate';

export async function createSchema(schema: Schema): Promise<void> {
  try {
    if (await getSchemaTemplate(schema.name)) {
      await requestAsAdmin(schemaClient.updateSchema, convertNewToOldSchema(schema));
    }
  } catch {
    await requestAsAdmin(schemaClient.createSchema, convertNewToOldSchema(schema));
  }
}
