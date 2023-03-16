import { allProjects } from '../../../../src/app/stores/AllProjects.store';
import { projectsService } from '../../../../src/app/services/gis/projects.service';
import { CrgProject } from '../../../../src/app/services/gis/projects.models';

declare const window: {
  projectsService: typeof projectsService;
  allProjects: typeof allProjects;
};

export async function getProjectsByTitle(title: string): Promise<CrgProject[]> {
  const projects = await browser.executeAsync<string, [string]>(async (title, callback) => {
    await window.projectsService.initAllProjectsStore();

    const projects = window.allProjects.list.filter(({ name }) => name === title);

    callback(JSON.stringify(projects));
  }, title);

  return JSON.parse(projects) as CrgProject[];
}
