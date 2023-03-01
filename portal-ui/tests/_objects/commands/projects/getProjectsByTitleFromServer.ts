import { projectsService } from '../../../../src/app/services/gis/projects.service';
import { CrgProject } from '../../../../src/app/services/gis/projects.models';

declare const window: {
  projectsService: typeof projectsService;
};

export async function getProjectsByTitleFromServer(title: string): Promise<CrgProject[]> {
  return await browser.executeAsync(async (title, callback) => {
    const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 20, filter: { name: title } });

    callback(projects);
  }, title);
}
