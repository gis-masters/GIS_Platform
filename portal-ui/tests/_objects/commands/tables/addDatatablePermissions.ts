import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { addTablePermission } from '../../../../src/app/services/data/permissions/permissions.service';

export let currentProject: CrgProject;

declare const window: {
  addTablePermission: typeof addTablePermission;
};

export async function addTablePermissions(
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
