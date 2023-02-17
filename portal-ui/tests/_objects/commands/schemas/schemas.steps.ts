import { Given } from '@wdio/cucumber-framework';

import { testSchemas } from './schema.templates';
import { createSchema } from './createSchema';

Given(/^существует заготовленная схема "(.*)"$/, async (title: string) => {
  const schema = testSchemas[title];
  if (!schema) {
    throw new Error(`Used unknown schema: '${title}'! Add it to tests schemas first.`);
  }

  await createSchema(schema);
});
