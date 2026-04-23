import { faker } from '@faker-js/faker';
import { Given } from '@wdio/cucumber-framework';

import { type Schema } from '../../../src/app/services/data/schema/schema.models';
import { PrincipalType, type Role } from '../../../src/app/services/permissions/permissions.models';
import { getUserByEmail } from '../commands/auth/getUserByEmail';
import { type TestUser } from '../commands/auth/testUsers';
import { getDatasetByTitle } from '../commands/datasets/getDatasetByTitle';
import { addVectorTablePermissions } from '../commands/tables/addVectorTablePermissions';
import { createVectorTableAs } from '../commands/tables/createVectorTableAs';
import { getVectorTableInDatasetByTitle } from '../commands/tables/getVectorTableByTitle';
import { getTestFeatures } from '../commands/tables/testFeatures';
import { createRecordAsAdmin } from '../commands/tables/vectorTableRecordsManagement';
import { type ScenarioScope } from '../ScenarioScope';

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
  'пользователем {user} внутри созданного набора данных создана таблица {string} с СК {string} по схеме {schema}',
  async function (this: ScenarioScope, user: TestUser, title: string, crs: string, schema: Schema) {
    this.latestVectorTable = await createVectorTableAs(
      this.latestDataset.identifier,
      {
        title,
        schemaId: schema.name,
        crs
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
  this.latestFeatures = await getTestFeatures(key, this.latestSchema);

  for (const feature of this.latestFeatures) {
    await createRecordAsAdmin(this.latestDataset.identifier, this.latestVectorTable.identifier, feature);
  }
});

Given('таблица наполнена данными, c один файлом, для фотослоя', async function (this: ScenarioScope) {
  this.latestFeatures = await getTestFeatures('для фотослоя с несколькими объектами', this.latestSchema);
  if (this.latestFeatures?.every(feature => feature.properties.photo)) {
    this.latestFeatures.forEach(
      feature =>
        (feature.properties.photo = [
          {
            id: this.latestUploadedFiles[0].id,
            size: this.latestUploadedFiles[0].size,
            title: this.latestUploadedFiles[0].title
          }
        ])
    );
  }
  for (const feature of this.latestFeatures) {
    await createRecordAsAdmin(this.latestDataset.identifier, this.latestVectorTable.identifier, feature);
  }
});

Given('таблица наполнена данными для фотослоя c несколькими объектами', async function (this: ScenarioScope) {
  this.latestFeatures = await getTestFeatures('для фотослоя с несколькими объектами', this.latestSchema);
  if (this.latestFeatures?.every(feature => feature.properties.photo)) {
    this.latestFeatures.forEach(feature => (feature.properties.photo = this.latestUploadedFiles));
  }

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
    const table = await getVectorTableInDatasetByTitle(this.latestDataset.identifier, tableTitle);
    await addVectorTablePermissions(
      { role, principalId: userFromApi.id, principalType: PrincipalType.USER },
      this.latestDataset.identifier,
      table.identifier
    );
  }
);
