import { Given } from '@wdio/cucumber-framework';

import { type Schema } from '../../../../src/app/services/data/schema/schema.models';
import { type ScenarioScope } from '../../ScenarioScope';
import { createSchema } from './createSchema';

Given('существует заготовленная схема {schema}', async function (this: ScenarioScope, schema: Schema) {
  await createSchema(schema);
  this.latestSchema = schema;
});
