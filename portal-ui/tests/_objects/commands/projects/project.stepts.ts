import { Given } from '@wdio/cucumber-framework';

import { createProject } from './createProject';
import { authenticateAsOwner } from '../auth/authenticate';
import { addProjectPermissions } from './addProjectPermissions';
import { deleteAllProjectsAsAdmin } from './deleteAllProjectsAsAdmin';
import { deleteProjectsByTitleAsAdmin } from './deleteProjectsByTitleAsAdmin';

Given(/^существует единственный проект с названием "(.*)"$/, async (title: string) => {
  await deleteAllProjectsAsAdmin();

  await authenticateAsOwner();
  const newProject = await createProject(title);
  await addProjectPermissions(newProject);
});

Given(/^существует проект "(.*)"$/, async (title: string) => {
  await createProject(title);
});

Given(/^отсутствует проект с названием "(.*)"$/, async (title: string) => {
  await deleteProjectsByTitleAsAdmin(title);
});

Given(/^удалены все проекты$/, async () => {
  await deleteAllProjectsAsAdmin();
});
