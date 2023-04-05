import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { requestAsAdmin } from '../requestAs';
import { _reqGetProjects } from '../../../../src/app/services/gis/projects/projects.client';

export async function getProjectByTitle(title: string): Promise<CrgProject> {
  const result = await requestAsAdmin(_reqGetProjects, { page: 0, pageSize: 2, filter: { name: title } });

  const projects = result._embedded?.projects;

  if (projects?.length !== 1) {
    throw new Error(`Ошибка получения проекта "${title}"`);
  }

  return projects[0];
}
