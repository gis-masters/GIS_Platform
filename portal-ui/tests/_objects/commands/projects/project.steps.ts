import { faker } from '@faker-js/faker';
import { Given, Then } from '@wdio/cucumber-framework';

import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { PrincipalType, Role } from '../../../../src/app/services/permissions/permissions.models';
import { ScenarioScope } from '../../ScenarioScope';
import { getUserByEmail } from '../auth/getUserByEmail';
import { TestUser } from '../auth/testUsers';
import { addProjectPermissionForUser } from './addProjectPermissions';
import { createProjectAs } from './createProjectAs';
import { deleteAllProjects } from './deleteAllProjects';
import { getProjectByTitle } from './getProjectByTitle';

Given(
  'существует проект {string}, созданный пользователем {user}',
  async function (this: ScenarioScope, title: string, user: TestUser) {
    this.latestProject = await createProjectAs(user, title);
  }
);

Given('существует проект, созданный пользователем {user}', async function (this: ScenarioScope, user: TestUser) {
  this.latestProject = await createProjectAs(user, faker.lorem.sentence(7));
});

Given('пользователем {user} созданы проекты: {strings}', async (user: TestUser, titles: string[]) => {
  for (const title of titles) {
    await createProjectAs(user, title);
  }
});

Given('все проекты удалены', async () => {
  await deleteAllProjects();
});

Given(
  'у пользователя {user} есть право на {role} на проект {string}',
  async function (this: ScenarioScope, user: TestUser, role: Role, projectName: string) {
    const currentUser = await getUserByEmail(user.email);
    const project = await getProjectByTitle(projectName);

    await addProjectPermissionForUser(
      { role, principalId: currentUser.id, principalType: PrincipalType.USER },
      project
    );
  }
);

Then('проект {string} отсутствует на сервере', async (projectName: string) => {
  let project: CrgProject | undefined;
  try {
    project = await getProjectByTitle(projectName);
  } catch {}

  await expect(project).toBeUndefined();
});
