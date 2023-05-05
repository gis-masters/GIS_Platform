import { Given } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';

import { getTestSchema } from './testSchemas';
import { createSchemaAsAdmin } from './createSchemaAsAdmin';

Given('существует заготовленная схема {string}', async function (this: ScenarioScope, title: string) {
  const schema = getTestSchema(title);

  await createSchemaAsAdmin(schema);

  this.latestSchema = schema;
});
