import { projectsService } from '../../../../src/app/services/gis/projects/projects.service';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';

declare const window: {
  projectsService: typeof projectsService;
};

export async function getProjectsByTitle(title: string): Promise<CrgProject[]> {
  const result = await browser.executeAsync<string, [string]>(async (title, callback) => {
    const [projects] = await window.projectsService.getProjects({ page: 0, pageSize: 100, filter: { name: title } });
    callback(JSON.stringify(projects));
  }, title);

  return JSON.parse(result) as CrgProject[];
}
