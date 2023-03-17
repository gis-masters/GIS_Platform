import { Given } from '@wdio/cucumber-framework';

import { testUsers } from '../auth/testUsers';
import { ScenarioScope } from '../../ScenarioScope';
import { getSchemaIdByTitle } from './getSchemaIdByTitle';
import { getPreparedFeatures } from './features.templates';
import { createVectorTableAs } from './createTestVectorTable';
import { createRecord } from './vectorTableRecordsManagement';

Given(
  'пользователем {string} внутри набора данных создана таблица {string} по схеме {string}',
  async function (this: ScenarioScope, user: keyof typeof testUsers, title: string, schemaTitle: string) {
    const schemaId = getSchemaIdByTitle(schemaTitle);

    this.latestVectorTable = await createVectorTableAs(
      this.latestDatasetId,
      {
        title,
        schemaId,
        crs: 'EPSG:28407'
      },
      user
    );
  }
);

Given('таблица наполнена данными {string}', async function (this: ScenarioScope, title: string) {
  this.latestFeatures = getPreparedFeatures(title, this.latestSchema);
  for (const feature of this.latestFeatures) {
    await createRecord(this.latestDatasetId, this.latestTableId, feature);
  }
});
