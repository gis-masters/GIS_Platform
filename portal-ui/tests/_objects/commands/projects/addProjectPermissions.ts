import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { permissionsClient } from '../../../../src/app/services/permissions/permissions.client';
import { RoleAssignmentBody } from '../../../../src/app/services/permissions/permissions.models';
import { requestAsAdmin } from '../requestAs';

export let currentProject: CrgProject;

export async function addProjectPermissionForUser(
  roleAssignment: RoleAssignmentBody,
  project: CrgProject
): Promise<void> {
  await requestAsAdmin(permissionsClient.addProjectPermission, roleAssignment, project.id);
}
