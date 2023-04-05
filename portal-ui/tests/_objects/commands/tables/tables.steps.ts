import { Given } from '@wdio/cucumber-framework';

import { getRoleByTitle, testUsers } from '../auth/testUsers';
import { ScenarioScope } from '../../ScenarioScope';
import { getSchemaIdByTitle } from './getSchemaIdByTitle';
import { getPreparedFeatures } from './features.templates';
import { createVectorTableAs } from './createTestVectorTable';
import { createRecord } from './vectorTableRecordsManagement';
import { getUserByEmail } from '../auth/getUserByEmail';
import { getVectorTableByTitle } from './getVectorTableByTitle';
import { addVectorTablePermissions } from './addVectorTablePermissions';
import { PrincipalType } from '../../../../src/app/services/data/permissions/permissions.models';
import { getDatasetByTitle } from '../datasets/getDatasetByTitle';

Given(
  'пользователем {string} внутри созданного набора данных создана таблица {string} по схеме {string}',
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

Given(
  'пользователем {string} внутри набора данных {string} создана таблица {string} по схеме {string}',
  async function (username: string, datasetTitle: string, title: string, schemaTitle: string) {
    const schemaId = getSchemaIdByTitle(schemaTitle);
    const dataset = await getDatasetByTitle(datasetTitle);

    this.latestVectorTable = await createVectorTableAs(
      dataset.identifier,
      {
        title,
        schemaId,
        crs: 'EPSG:28407'
      },
      username
    );
  }
);

Given('таблица наполнена данными {string}', async function (this: ScenarioScope, title: string) {
  this.latestFeatures = getPreparedFeatures(title, this.latestSchema);
  for (const feature of this.latestFeatures) {
    await createRecord(this.latestDatasetId, this.latestTableId, feature);
  }
});

Given(
  'у пользователя {string} есть право на {string} на таблицу {string}',
  async function (this: ScenarioScope, user: keyof typeof testUsers, role: string, tableName: string) {
    const currentUser = await getUserByEmail(testUsers[user].email);
    if (!currentUser) {
      throw new Error(`Не найден пользователь ${user}`);
    }
    const table = await getVectorTableByTitle(this.latestDatasetId, tableName);
    await addVectorTablePermissions(
      { role: getRoleByTitle(role), principalId: currentUser.id, principalType: PrincipalType.USER },
      this.latestDatasetId,
      table.identifier
    );
  }
);
