import { libraryClient } from '../../../../src/app/services/data/library/library.client';
import { permissionsClient } from '../../../../src/app/services/permissions/permissions.client';
import { RoleAssignmentBody } from '../../../../src/app/services/permissions/permissions.models';
import { requestAsAdmin } from '../requestAs';

export async function addRecordPermissions(
  roleAssignment: RoleAssignmentBody,
  recordId: number,
  libraryTableName: string
): Promise<void> {
  const url = libraryClient.getDocumentLibraryRecordRoleAssignmentUrl(libraryTableName, recordId);

  await requestAsAdmin(permissionsClient.addEntityPermission, roleAssignment, url);
}
