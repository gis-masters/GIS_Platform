import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { permissionsClient } from '../../../../src/app/services/data/permissions/permissions.client';
import { requestAsAdmin } from '../requestAs';

export let currentProject: CrgProject;

export async function addProjectPermissionForUser(
  roleAssignment: RoleAssignmentBody,
  project: CrgProject
): Promise<void> {
  await requestAsAdmin(permissionsClient.addProjectPermission, roleAssignment, project.id);
}
