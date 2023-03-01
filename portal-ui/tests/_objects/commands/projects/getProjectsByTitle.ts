import { allProjects } from '../../../../src/app/stores/AllProjects.store';
import { projectsService } from '../../../../src/app/services/gis/projects.service';
import { CrgProject } from '../../../../src/app/services/gis/projects.models';

declare const window: {
  projectsService: typeof projectsService;
  allProjects: typeof allProjects;
};

export async function getProjectsByTitle(title: string): Promise<CrgProject[]> {
  return await browser.executeAsync(async (title, callback) => {
    await window.projectsService.initAllProjectsStore();

    const projects = window.allProjects.list.filter(({ name }) => name === title);

    callback(projects);
  }, title);
}
