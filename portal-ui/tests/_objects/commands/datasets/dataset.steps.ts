import { faker } from '@faker-js/faker';
import { Given } from '@wdio/cucumber-framework';

import { getRoleByTitle, getTestUser, testUsers } from '../auth/testUsers';
import { ScenarioScope } from '../../ScenarioScope';
import { createDatasetAs } from './createDatasetAs';
import { deleteAllDatasetsAsAdmin } from './deleteAllDatasetsAsAdmin';
import { getUserByEmail } from '../auth/getUserByEmail';
import { addDatasetPermissions } from './addDatasetPermissions';
import { PrincipalType } from '../../../../src/app/services/data/permissions/permissions.models';
import { getDatasetByTitle } from './getDatasetByTitle';

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

Given(
  'у пользователя {string} есть право на {string} на созданный набор данных',
  async function (this: ScenarioScope, user: keyof typeof testUsers, role: string) {
    const currentUser = await getUserByEmail(testUsers[user].email);

    await addDatasetPermissions(
      { role: getRoleByTitle(role), principalId: currentUser.id, principalType: PrincipalType.USER },
      this.latestDataset.identifier
    );
  }
);

Given(
  'у пользователя {string} есть право на {string} на набор данных {string}',
  async function (username: string, role: string, title: string) {
    const currentUser = await getUserByEmail(getTestUser(username).email);
    const dataset = await getDatasetByTitle(title);

    await addDatasetPermissions(
      { role: getRoleByTitle(role), principalId: currentUser.id, principalType: PrincipalType.USER },
      dataset.identifier
    );
  }
);
