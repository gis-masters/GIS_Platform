import { Given } from '@wdio/cucumber-framework';

import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { ScenarioScope } from '../../ScenarioScope';
import { createSchema } from './createSchema';

Given('существует заготовленная схема {schema}', async function (this: ScenarioScope, schema: Schema) {
  await createSchema(schema);
  this.latestSchema = schema;
});
