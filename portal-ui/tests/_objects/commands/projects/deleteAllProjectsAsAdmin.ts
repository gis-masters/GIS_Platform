import { authenticateAsAdmin } from '../auth/authenticate';
import { projectsService } from '../../../../src/app/services/gis/projects/projects.service';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';

declare const window: {
  projectsService: typeof projectsService;
};

export async function deleteAllProjectsAsAdmin(): Promise<void> {
  await authenticateAsAdmin();

  await browser.executeAsync(async callback => {
    const projectList: CrgProject[] = await window.projectsService.getAllProjects();
    const killList: number[] = projectList.map(({ id }) => id);

    for (const id of killList) {
      await window.projectsService.delete(id);
    }
    callback();
  });
}
