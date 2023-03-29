import { faker } from '@faker-js/faker';
import { Given } from '@wdio/cucumber-framework';

import { testUsers } from '../auth/testUsers';
import { ScenarioScope } from '../../ScenarioScope';
import { createDatasetAs } from './createDatasetAs';
import { deleteAllDatasetsAsAdmin } from './deleteAllDatasetsAsAdmin';

Given(
  'существует набор данных {string}, созданный пользователем {string}',
  async function (this: ScenarioScope, title: string, user: keyof typeof testUsers) {
    this.latestDataset = await createDatasetAs(title, user);
  }
);

Given(
  'существует набор данных, созданный пользователем {string}',
  async function (this: ScenarioScope, user: keyof typeof testUsers) {
    this.latestDataset = await createDatasetAs(faker.lorem.sentence(7), user);
  }
);

Given('все наборы данных удалены', async function () {
  await deleteAllDatasetsAsAdmin();
});
