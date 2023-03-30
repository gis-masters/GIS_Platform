import { RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { addTablePermission } from '../../../../src/app/services/data/permissions/permissions.service';

declare const window: {
  addTablePermission: typeof addTablePermission;
};

export async function addVectorTablePermissions(
  roleAssignment: RoleAssignmentBody,
  datasetId: string,
  tableId: string
): Promise<void> {
  await browser.executeAsync(
    async (roleAssignment: RoleAssignmentBody, datasetId: string, tableId: string, callback) => {
      await window.addTablePermission(roleAssignment, datasetId, tableId);
      callback();
    },
    roleAssignment,
    datasetId,
    tableId
  );
}
