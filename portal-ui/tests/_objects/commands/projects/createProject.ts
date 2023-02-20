import { CrgProject } from '../../../../src/app/services/gis/projects.models';
import { projectsService } from '../../../../src/app/services/gis/projects.service';

declare const window: {
  projectsService: typeof projectsService;
};

export async function createProject(title: string): Promise<CrgProject> {
  return await browser.executeAsync(async (title, callback) => {
    const newProject = await window.projectsService.create(title);

    callback(newProject);
  }, title);
}
