import { Given } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';
import { authenticateAsAdmin } from '../auth/authenticate';

import { createSchemaAsAdmin } from './createSchemaAsAdmin';
import { testSchemas } from './testSchemas';

Given('существует заготовленная схема {string}', async function (this: ScenarioScope, title: string) {
  await authenticateAsAdmin();

  const schema = testSchemas[title];
  if (!schema) {
    throw new Error(`Used unknown schema: '${title}'! Add it to tests schemas first.`);
  }

  await createSchemaAsAdmin(schema);

  this.latestSchema = schema;
});
