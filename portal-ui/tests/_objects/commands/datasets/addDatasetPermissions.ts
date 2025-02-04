import { permissionsClient } from '../../../../src/app/services/permissions/permissions.client';
import { RoleAssignmentBody } from '../../../../src/app/services/permissions/permissions.models';
import { requestAsAdmin } from '../requestAs';

export async function addDatasetPermissions(
  roleAssignment: RoleAssignmentBody,
  datasetIdentifier: string
): Promise<void> {
  await requestAsAdmin(permissionsClient.addDatasetPermission, roleAssignment, datasetIdentifier);
}
