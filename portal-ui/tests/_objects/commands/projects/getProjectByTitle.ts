import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { requestAsAdmin } from '../requestAs';
import { projectsClient } from '../../../../src/app/services/gis/projects/projects.client';

export async function getProjectByTitle(title: string): Promise<CrgProject> {
  const result = await requestAsAdmin(projectsClient.getProjects, {
    page: 0,
    pageSize: 2,
    filter: { name: title }
  });

  const projects = result.content;

  if (projects?.length !== 1) {
    throw new Error(`Ошибка получения проекта "${title}"`);
  }

  return projects[0];
}
