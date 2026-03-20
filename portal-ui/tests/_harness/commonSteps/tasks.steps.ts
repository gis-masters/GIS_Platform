import { Given } from '@wdio/cucumber-framework';

import { type TestUser } from '../commands/auth/testUsers';
import { createTask } from '../commands/tasks/createTask';
import { deleteAllTasks } from '../commands/tasks/deleteAllTasks';
import { type ScenarioScope } from '../ScenarioScope';

Given('удалены все задачи', async function () {
  await deleteAllTasks();
});

Given(
  'создана тестовая задача с исполнителем {user} и начальником {user} по контент типу {string}',
  async function (this: ScenarioScope, user: TestUser, boss: TestUser, contentType: string) {
    this.latestTask = await createTask(user, boss, contentType);
  }
);
