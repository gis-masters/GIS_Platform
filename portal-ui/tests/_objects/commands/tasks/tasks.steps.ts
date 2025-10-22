import { Given } from '@wdio/cucumber-framework';

import { type ScenarioScope } from '../../ScenarioScope';
import { type TestUser } from '../auth/testUsers';
import { createTask } from './createTask';
import { deleteAllTasks } from './deleteAllTasks';

Given('удалены все задачи', async function () {
  await deleteAllTasks();
});

Given(
  'создана тестовая задача с исполнителем {user} и начальником {user} по контент типу {string}',
  async function (this: ScenarioScope, user: TestUser, boss: TestUser, contentType: string) {
    this.latestTask = await createTask(user, boss, contentType);
  }
);
