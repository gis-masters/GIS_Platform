import { faker } from '@faker-js/faker';
import { Given } from '@wdio/cucumber-framework';

import { TestUser } from '../auth/testUsers';
import { ScenarioScope } from '../../ScenarioScope';
import { getTestFeatures } from './testFeatures';
import { createVectorTableAs } from './createVectorTableAs';
import { createRecordAsAdmin } from './vectorTableRecordsManagement';
import { getUserByEmail } from '../auth/getUserByEmail';
import { getVectorTableByTitle } from './getVectorTableByTitle';
import { getDatasetByTitle } from '../datasets/getDatasetByTitle';
import { addVectorTablePermissions } from './addVectorTablePermissions';
import { PrincipalType, Role } from '../../../../src/app/services/data/permissions/permissions.models';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';

const DEFAULT_CRS = 'EPSG:28406';

Given(
  'пользователем {user} внутри созданного набора данных создана таблица {string} по схеме {schema}',
  async function (this: ScenarioScope, user: TestUser, title: string, schema: Schema) {
    this.latestVectorTable = await createVectorTableAs(
      this.latestDataset.identifier,
      {
        title,
        schemaId: schema.name,
        crs: DEFAULT_CRS
      },
      user
    );
  }
);

Given(
  'внутри созданного набора данных существует таблица по схеме {schema} созданная пользователем {user}',
  async function (this: ScenarioScope, schema: Schema, user: TestUser) {
    this.latestVectorTable = await createVectorTableAs(
      this.latestDataset.identifier,
      {
        title: faker.lorem.sentence(7),
        schemaId: schema.name,
        crs: DEFAULT_CRS
      },
      user
    );
  }
);

Given(
  'пользователем {user} внутри набора данных {string} создана таблица {string} по схеме {schema}',
  async function (user: TestUser, datasetTitle: string, title: string, schema: Schema) {
    const dataset = await getDatasetByTitle(datasetTitle);

    this.latestVectorTable = await createVectorTableAs(
      dataset.identifier,
      {
        title,
        schemaId: schema.name,
        crs: DEFAULT_CRS
      },
      user
    );
  }
);

Given('таблица наполнена данными {string}', async function (this: ScenarioScope, key: string) {
  this.latestFeatures = getTestFeatures(key, this.latestSchema);
  for (const feature of this.latestFeatures) {
    await createRecordAsAdmin(this.latestDataset.identifier, this.latestVectorTable.identifier, feature);
  }
});

Given(
  'у пользователя {user} есть право на {role} на таблицу {string}',
  async function (this: ScenarioScope, user: TestUser, role: Role, tableTitle: string) {
    const userFromApi = await getUserByEmail(user.email);
    if (!userFromApi) {
      throw new Error(`Не найден пользователь ${user.email}`);
    }
    const table = await getVectorTableByTitle(this.latestDataset.identifier, tableTitle);
    await addVectorTablePermissions(
      { role, principalId: userFromApi.id, principalType: PrincipalType.USER },
      this.latestDataset.identifier,
      table.identifier
    );
  }
);
