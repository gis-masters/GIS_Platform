import { Given } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';
import { createDatasetAs } from './createDatasetAs';
import { deleteAllDatasetsAsAdmin } from './deleteAllDatasetsAsAdmin';
import { testUsers } from '../auth/testUsers';

Given(
  'пользователем {string} создан набор данных {string}',
  async function (this: ScenarioScope, user: keyof typeof testUsers, title: string) {
    this.latestDataset = await createDatasetAs(title, user);
  }
);

Given(/^все наборы данных удалены администратором$/, async () => {
  await deleteAllDatasetsAsAdmin();
});

Given(/^все наборы данных удалены$/, async () => {
  await deleteAllDatasetsAsAdmin();
});
