import { Given } from '@wdio/cucumber-framework';

import { projectsService } from '../../../../src/app/services/gis/projects.service';
import { allProjects } from '../../../../src/app/stores/AllProjects.store';
import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: { projectsService: typeof projectsService; allProjects: typeof allProjects };

export async function deleteProjectsByTitle(title: string): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(async (title, callback) => {
    await window.projectsService.initAllProjectsStore();

    const killList: number[] = window.allProjects.list.filter(({ name }) => name === title).map(({ id }) => id);

    for (const id of killList) {
      await window.projectsService.delete(id);
    }
    callback();
  }, title);
}

Given(/^отсутствует проект с названием "(.*)"$/, async (title: string) => {
  await deleteProjectsByTitle(title);
});
