import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { schemaService } from '../../../../src/app/services/data/schema/schema.service';

declare const window: {
  schemaService: typeof schemaService;
};

export async function getSchemaByTitle(schemaId: string): Promise<Schema> {
  const schema: Schema = await browser.executeAsync(async (schemaId, callback) => {
    const schema = await window.schemaService.getSchema(schemaId);

    callback(schema);
  }, schemaId);

  if (!schema) {
    throw new Error(`Нет схемы ${schemaId}`);
  }

  return schema;
}
