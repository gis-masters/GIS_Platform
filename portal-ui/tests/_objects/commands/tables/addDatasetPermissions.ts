import { RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { addDatasetPermission } from '../../../../src/app/services/data/permissions/permissions.service';

declare const window: {
  addDatasetPermission: typeof addDatasetPermission;
};

export async function addDatasetPermissions(roleAssignment: RoleAssignmentBody, datasetId: string): Promise<void> {
  await browser.executeAsync(
    async (roleAssignment: RoleAssignmentBody, datasetId: string, callback) => {
      await window.addDatasetPermission(roleAssignment, datasetId);

      callback();
    },
    roleAssignment,
    datasetId
  );
}
