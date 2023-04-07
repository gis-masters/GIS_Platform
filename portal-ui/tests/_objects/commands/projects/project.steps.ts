import { faker } from '@faker-js/faker';
import { Given, Then } from '@wdio/cucumber-framework';

import { createProject } from './createProject';
import { createProjects } from './createProjects';
import { ScenarioScope } from '../../ScenarioScope';
import { authenticateAs } from '../auth/authenticate';
import { getUserByEmail } from '../auth/getUserByEmail';
import { getRoleByTitle, getTestUser } from '../auth/testUsers';
import { deleteAllProjectsAsAdmin } from './deleteAllProjectsAsAdmin';
import { addProjectPermissionForUser } from './addProjectPermissions';
import { PrincipalType } from '../../../../src/app/services/data/permissions/permissions.models';
import { getProjectByTitle } from './getProjectByTitle';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';

Given(
  'пользователем {string} создан проект {string}',
  async function (this: ScenarioScope, user: string, title: string) {
    await authenticateAs(getTestUser(user));

    this.latestProject = await createProject(title);
  }
);

Given('существует проект, созданный пользователем {string}', async function (this: ScenarioScope, user: string) {
  await authenticateAs(getTestUser(user));

  this.latestProject = await createProject(faker.lorem.sentence(7));
});

Given(/^пользователем "(.*)" созданы проекты: (".+"[ ,]*)+$/, async (user: string, titles: string) => {
  await authenticateAs(getTestUser(user));
  await createProjects(titles.slice(1, -1).split('", "'));
});

Given('все проекты удалены', async () => {
  await deleteAllProjectsAsAdmin();
});

Given(
  'у пользователя {string} есть право на {string} на проект {string}',
  async function (this: ScenarioScope, user: string, role: string, projectName: string) {
    const currentUser = await getUserByEmail(getTestUser(user).email);
    const project = await getProjectByTitle(projectName);

    await addProjectPermissionForUser(
      { role: getRoleByTitle(role), principalId: currentUser.id, principalType: PrincipalType.USER },
      project
    );
  }
);

Then('проект {string} отсутствует на сервере', async (projectName: string) => {
  let project: CrgProject | undefined;
  try {
    project = await getProjectByTitle(projectName);
  } catch {}

  expect(project).toBeUndefined();
});
