import { authenticateAsAdmin } from '../auth/authenticate';
import { allProjects } from '../../../../src/app/stores/AllProjects.store';
import { projectsService } from '../../../../src/app/services/gis/projects/projects.service';

declare const window: {
  projectsService: typeof projectsService;
  allProjects: typeof allProjects;
};

export async function deleteProjectsByTitleAsAdmin(title: string): Promise<void> {
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
