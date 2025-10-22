import { projectsClient } from '../../../../src/app/services/gis/projects/projects.client';
import { type CrgProject, type NewCrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { type TestUser } from '../auth/testUsers';
import { requestAs } from '../requestAs';

export async function createProjectAs(user: TestUser, project: NewCrgProject): Promise<CrgProject> {
  return await requestAs(user, projectsClient.createProject, project);
}
