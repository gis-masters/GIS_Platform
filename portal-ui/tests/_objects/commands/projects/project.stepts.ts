import { Given, Then } from '@wdio/cucumber-framework';

import { createProject } from './createProject';
import { createProjects } from './createProjects';
import { ScenarioScope } from '../../scenarioScope';
import { authenticateAs } from '../auth/authenticate';
import { getUserByEmail } from '../auth/getUserByEmail';
import { testUsers, userRoles } from '../auth/testUsers';
import { deleteAllProjectsAsAdmin } from './deleteAllProjectsAsAdmin';
import { addProjectPermissionForUser } from './addProjectPermissions';
import { getProjectsByTitleFromServer } from './getProjectsByTitleFromServer';
import { PrincipalType } from '../../../../src/app/services/data/permissions.models';

Given(
  'пользователем {string} создан проект {string}',
  async function (this: ScenarioScope, user: keyof typeof testUsers, title: string) {
    await authenticateAs(testUsers[user]);

    this.latestProject = await createProject(title);
  }
);

Given(/^пользователем "(.*)" созданы проекты: (".+"[ ,]*)+$/, async (user: keyof typeof testUsers, titles: string) => {
  await authenticateAs(testUsers[user]);

  await createProjects(titles.slice(1, -1).split('", "'));
});

Given('все проекты удалены', async () => {
  await deleteAllProjectsAsAdmin();
});

Given(
  'пользователю {string} выдано право на {string} на проект {string}',
  async function (this: ScenarioScope, user: keyof typeof testUsers, role: string, projectName: string) {
    const currentUser = await getUserByEmail(testUsers[user].email);
    if (!currentUser) {
      throw new Error(`Не найден пользователь ${user}`);
    }

    const projects = await getProjectsByTitleFromServer(projectName);
    if (projects.length !== 1) {
      throw new Error(`Ошибка получения проекта "${projectName}"`);
    }

    await addProjectPermissionForUser(
      { role: userRoles[role], principalId: currentUser.id, principalType: PrincipalType.USER },
      projects[0]
    );
  }
);

Then('проект {string} отсутствует на сервере', async (projectName: string) => {
  const projects = await getProjectsByTitleFromServer(projectName);

  expect(projects.length).toEqual(0);
});
