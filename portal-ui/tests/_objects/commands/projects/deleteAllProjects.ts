import { projectsClient } from '../../../../src/app/services/gis/projects/projects.client';
import { requestAsAdmin } from '../requestAs';

export async function deleteAllProjects(): Promise<void> {
  const allProjects = await requestAsAdmin(projectsClient.getAllProjects);

  for (const project of allProjects) {
    try {
      const allProjectsInFolder = await requestAsAdmin(projectsClient.getAllProjectsInFolder, project.id);
      for (const projectInFolder of allProjectsInFolder) {
        await requestAsAdmin(projectsClient.deleteProject, projectInFolder.id);
      }
    } catch {
      // ignore
    }

    await requestAsAdmin(projectsClient.deleteProject, project.id);
  }
}
