import { Given } from '@wdio/cucumber-framework';

import { projectsService } from '../../../../src/app/services/gis/projects.service';
import { allProjects } from '../../../../src/app/stores/AllProjects.store';
import { authenticateAsOwner } from '../auth/authenticate';
import { deleteAllProjects } from './deleteAllProjects';
import { usersService } from '../../../../src/app/services/auth/users.service';
import { addProjectPermission } from '../../../../src/app/services/data/permissions.client';

declare const window: {
  projectsService: typeof projectsService;
  usersService: typeof usersService;
  addProjectPermission: typeof addProjectPermission;
  allProjects: typeof allProjects;
};

export async function createProject(title: string): Promise<void> {
  await deleteAllProjects();
  await authenticateAsOwner();

  await browser.executeAsync(async (title, callback) => {
    const newProject = await window.projectsService.create(title);
    const allUsers = await window.usersService.getAll();
    const viewer = allUsers.find(({ job }) => job === 'Чтец');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await window.addProjectPermission({ role: 'VIEWER', principalId: viewer.id, principalType: 'user' }, newProject);
    callback();
  }, title);
}

Given(/^существует только проект с названием "(.*)"$/, async (title: string) => {
  await createProject(title);
});
