import { docLibraryClient } from '../../../../src/app/services/data/docLibrary/docLibrary.client';
import { permissionsClient } from '../../../../src/app/services/data/permissions/permissions.client';
import { RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { requestAsAdmin } from '../requestAs';

export async function addRecordPermissions(
  roleAssignment: RoleAssignmentBody,
  recordId: number,
  libraryTableName: string
): Promise<void> {
  const url = docLibraryClient.getDocumentLibraryRecordRoleAssignmentUrl(libraryTableName, recordId);

  await requestAsAdmin(permissionsClient.addEntityPermission, roleAssignment, url);
}
