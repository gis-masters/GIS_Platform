import { projectsClient } from '../../../../src/app/services/gis/projects/projects.client';
import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { TestUser } from '../auth/testUsers';
import { requestAs } from '../requestAs';

export async function createProjectAs(user: TestUser, name: string): Promise<CrgProject> {
  return await requestAs(user, projectsClient.createProject, { name, folder: false });
}
