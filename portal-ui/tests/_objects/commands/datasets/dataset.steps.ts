import { faker } from '@faker-js/faker';
import { Given } from '@wdio/cucumber-framework';

import { PrincipalType, Role } from '../../../../src/app/services/permissions/permissions.models';
import { ScenarioScope } from '../../ScenarioScope';
import { getUserByEmail } from '../auth/getUserByEmail';
import { TestUser } from '../auth/testUsers';
import { addDatasetPermissions } from './addDatasetPermissions';
import { createDatasetAs } from './createDatasetAs';
import { deleteAllDatasetsAsAdmin } from './deleteAllDatasetsAsAdmin';
import { getDatasetByTitle } from './getDatasetByTitle';

Given(
  'существует набор данных {string}, созданный пользователем {user}',
  async function (this: ScenarioScope, title: string, user: TestUser) {
    this.latestDataset = await createDatasetAs(title, user);
  }
);

Given('существует набор данных, созданный пользователем {user}', async function (this: ScenarioScope, user: TestUser) {
  this.latestDataset = await createDatasetAs(faker.lorem.sentence(7), user);
});

Given('все наборы данных удалены', async function () {
  await deleteAllDatasetsAsAdmin();
});

Given(
  'у пользователя {user} есть право на {role} на созданный набор данных',
  async function (this: ScenarioScope, user: TestUser, role: Role) {
    const userFromApi = await getUserByEmail(user.email);

    await addDatasetPermissions(
      { role, principalId: userFromApi.id, principalType: PrincipalType.USER },
      this.latestDataset.identifier
    );
  }
);

Given(
  'у пользователя {user} есть право на {role} на набор данных {string}',
  async function (user: TestUser, role: Role, title: string) {
    const userFromApi = await getUserByEmail(user.email);
    const dataset = await getDatasetByTitle(title);

    await addDatasetPermissions(
      { role, principalId: userFromApi.id, principalType: PrincipalType.USER },
      dataset.identifier
    );
  }
);
