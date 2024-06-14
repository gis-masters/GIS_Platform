import { schemaClient } from '../../../../src/app/services/data/schema/schema.client';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { convertNewToOldSchema } from '../../../../src/app/services/data/schema/schema.utils';
import { requestAsAdmin } from '../requestAs';
import { getSchema } from './getSchema';

export async function createSchema(schema: Schema): Promise<void> {
  try {
    if (await getSchema(schema.name)) {
      await requestAsAdmin(schemaClient.updateSchema, convertNewToOldSchema(schema));
    }
  } catch {
    await requestAsAdmin(schemaClient.createSchema, convertNewToOldSchema(schema));
  }
}
