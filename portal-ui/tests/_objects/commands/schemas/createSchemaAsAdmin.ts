import { schemaService } from '../../../../src/app/services/data/schema/schema.service';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { convertNewToOldSchema } from '../../../../src/app/services/data/schema/schema.utils';
import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  schemaService: typeof schemaService;
  convertNewToOldSchema: typeof convertNewToOldSchema;
};

async function createSchema(schema: Schema): Promise<void> {
  await browser.executeAsync(async (schema, callback) => {
    const parsedSchema = JSON.parse(schema) as Schema;

    if (!parsedSchema.name) {
      return;
    }

    try {
      await window.schemaService.getSchema(parsedSchema.name);
    } catch {
      await window.schemaService.createSchema(parsedSchema);
    }

    callback();
  }, JSON.stringify(schema));
}

export async function createSchemaAsAdmin(schema: Schema): Promise<void> {
  await authenticateAsAdmin();

  await createSchema(schema);
}
