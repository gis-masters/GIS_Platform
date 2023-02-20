import { CrgProject } from '../../../../src/app/services/gis/projects.models';
import { usersService } from '../../../../src/app/services/auth/users.service';
import { PrincipalType, Role, RoleAssignmentBody } from '../../../../src/app/services/data/permissions.models';
import { addProjectPermission } from '../../../../src/app/services/data/permissions.client';
import { getUserByEmail } from '../auth/getUserByEmail';
import { testUsers } from '../auth/testUsers';

export let currentProject: CrgProject;

declare const window: {
  usersService: typeof usersService;
  addProjectPermission: typeof addProjectPermission;
};

async function addPermission(roleAssignment: RoleAssignmentBody, project: CrgProject) {
  await browser.executeAsync(
    async (roleAssignment: RoleAssignmentBody, project: CrgProject, callback) => {
      await window.addProjectPermission(roleAssignment, project);

      callback();
    },
    roleAssignment,
    project
  );
}

export async function addProjectPermissions(project: CrgProject): Promise<void> {
  const viewer = await getUserByEmail(testUsers['Читатель данных'].email);
  const contributor = await getUserByEmail(testUsers['Редактор данных'].email);
  if (!viewer || !contributor) {
    throw new Error('Не созданы тестовые пользователи?');
  }

  await addPermission({ role: Role.VIEWER, principalId: viewer.id, principalType: PrincipalType.USER }, project);
  await addPermission({ role: Role.VIEWER, principalId: contributor.id, principalType: PrincipalType.USER }, project);
}
