import { Given } from '@wdio/cucumber-framework';

import { deleteAllTasks } from './deleteAllTasks';
import { TestUser } from '../auth/testUsers';
import { createTask } from './createTask';
import { ScenarioScope } from '../../ScenarioScope';

Given('удалены все задачи', async function () {
  await deleteAllTasks();
});

Given(
  'создана тестовая задача с исполнителем {user} и начальником {user} по контент типу {string}',
  async function (this: ScenarioScope, user: TestUser, boss: TestUser, contentType: string) {
    this.latestTask = await createTask(user, boss, contentType);
  }
);
