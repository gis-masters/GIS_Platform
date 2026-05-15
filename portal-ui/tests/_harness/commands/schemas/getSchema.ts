import { schemaClient } from '../../../../src/app/services/data/schema/schema.client';
import { type Schema } from '../../../../src/app/services/data/schema/schema.models';
import { convertOldToNewSchema } from '../../../../src/app/services/data/schema/utils/convertOldToNewSchema';
import { requestAsAdmin } from '../requestAs';

export async function getSchema(schemaName: string): Promise<Schema> {
  const response = await requestAsAdmin(schemaClient.getSchema, [schemaName]);

  if (!response || !response[0]) {
    throw new Error(`Нет схемы ${schemaName}`);
  }

  return convertOldToNewSchema(response[0]);
}
