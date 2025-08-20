import { permissionsClient } from '../../../../src/app/services/permissions/permissions.client';
import { RoleAssignmentBody } from '../../../../src/app/services/permissions/permissions.models';
import { requestAsAdmin } from '../requestAs';

export async function addVectorTablePermissions(
  roleAssignment: RoleAssignmentBody,
  datasetIdentifier: string,
  tableIdentifier: string
): Promise<void> {
  await requestAsAdmin(permissionsClient.addTablePermission, roleAssignment, datasetIdentifier, tableIdentifier);
}
