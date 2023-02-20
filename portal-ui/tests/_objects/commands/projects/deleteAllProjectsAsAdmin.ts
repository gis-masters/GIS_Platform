import { authenticateAsAdmin } from '../auth/authenticate';
import { allProjects } from '../../../../src/app/stores/AllProjects.store';
import { projectsService } from '../../../../src/app/services/gis/projects.service';

declare const window: { projectsService: typeof projectsService; allProjects: typeof allProjects };

export async function deleteAllProjectsAsAdmin(): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(async callback => {
    await window.projectsService.initAllProjectsStore();

    const killList: number[] = window.allProjects.list.map(({ id }) => id);

    for (const id of killList) {
      await window.projectsService.delete(id);
    }
    callback();
  });
}
