import { requestAsAdmin } from '../requestAs';
import { projectsClient } from '../../../../src/app/services/gis/projects/projects.client';

export async function deleteAllProjects(): Promise<void> {
  const allProjects = await requestAsAdmin(projectsClient.getAllProjects);

  for (const project of allProjects) {
    await requestAsAdmin(projectsClient.deleteProject, project.id);
  }
}
