import { type Schema } from '../../../../src/app/services/data/schema/schema.models';
import { convertOldToNewSchema } from '../../../../src/app/services/data/schema/utils/convertOldToNewSchema';
import { schemaTemplateClient } from '../../../../src/app/services/data/schemaTemplate/schemaTemplate.client';
import { requestAsAdmin } from '../requestAs';

export async function getSchemaTemplate(schemaName: string): Promise<Schema> {
  const response = await requestAsAdmin(schemaTemplateClient.getSchemaTemplates, [schemaName]);

  if (!response || !response[0]) {
    throw new Error(`Нет схемы ${schemaName}`);
  }

  return convertOldToNewSchema(response[0].classRule);
}
