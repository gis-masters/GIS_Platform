import { Given } from '@wdio/cucumber-framework';

import { type Schema } from '../../../src/app/services/data/schema/schema.models';
import { createSchema } from '../commands/schemas/createSchema';
import { type ScenarioScope } from '../ScenarioScope';

Given('существует заготовленная схема {schema}', async function (this: ScenarioScope, schema: Schema) {
  await createSchema(schema);
  this.latestSchema = schema;
});
