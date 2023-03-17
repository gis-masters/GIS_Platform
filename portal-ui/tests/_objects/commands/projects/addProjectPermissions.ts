import { CrgProject } from '../../../../src/app/services/gis/projects/projects.models';
import { usersService } from '../../../../src/app/services/auth/users/users.service';
import { RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { addProjectPermission } from '../../../../src/app/services/data/permissions/permissions.service';

export let currentProject: CrgProject;

declare const window: {
  usersService: typeof usersService;
  addProjectPermission: typeof addProjectPermission;
};

export async function addProjectPermissionForUser(
  roleAssignment: RoleAssignmentBody,
  project: CrgProject
): Promise<void> {
  await browser.executeAsync(
    async (roleAssignment: RoleAssignmentBody, project: CrgProject, callback) => {
      await window.addProjectPermission(roleAssignment, project);

      callback();
    },
    roleAssignment,
    project
  );
}
