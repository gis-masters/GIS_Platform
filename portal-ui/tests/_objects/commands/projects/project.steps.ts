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
    this.latestProject = await createProjectAs(user, { name: title, folder: false });
  }
);

Given(
  'существует папка проектов {string}, созданная пользователем {user}',
  async function (this: ScenarioScope, title: string, user: TestUser) {
    this.latestProjectFolder = await createProjectAs(user, { name: title, folder: true });
  }
);

Given(
  'в папке проекта создан проект {string} пользователем {user}',
  async function (this: ScenarioScope, title: string, user: TestUser) {
    const folder = this.latestProjectFolder;

    if (this.latestProjectFolder) {
      this.latestProject = await createProjectAs(user, { name: title, folder: false, parentId: folder.id });
    }
  }
);

Given(
  'в папке проекта создана папка проекта {string} пользователем {user}',
  async function (this: ScenarioScope, title: string, user: TestUser) {
    const folder = this.latestProjectFolder;

    if (this.latestProjectFolder) {
      this.latestProject = await createProjectAs(user, { name: title, folder: true, parentId: folder.id });
    }
  }
);

Given('существует проект, созданный пользователем {user}', async function (this: ScenarioScope, user: TestUser) {
  this.latestProject = await createProjectAs(user, { name: faker.lorem.sentence(7), folder: false });
});

Given('пользователем {user} созданы проекты: {strings}', async (user: TestUser, titles: string[]) => {
  for (const title of titles) {
    await createProjectAs(user, { name: title, folder: false });
  }
});

Given('все проекты удалены', async () => {
  await deleteAllProjects();
});

const projectPermission = async function (this: ScenarioScope, user: TestUser, role: Role, projectName: string) {
  const currentUser = await getUserByEmail(user.email);
  const project = await getProjectByTitle(projectName);

  await addProjectPermissionForUser({ role, principalId: currentUser.id, principalType: PrincipalType.USER }, project);
};

Given('у пользователя {user} есть право на {role} на проект {string}', projectPermission);

Given('у пользователя {user} есть право на {role} на папку проекта {string}', projectPermission);

Then('проект {string} отсутствует на сервере', async (projectName: string) => {
  let project: CrgProject | undefined;
  try {
    project = await getProjectByTitle(projectName);
  } catch {}

  await expect(project).toBeUndefined();
});
