import { type Library } from '../../../../src/app/services/data/library/library.models';
import { type setLibraryPermission } from '../../../../src/app/services/data/library/library.service';
import { type RoleAssignmentBody } from '../../../../src/app/services/permissions/permissions.models';
import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  setLibraryPermission: typeof setLibraryPermission;
};

export async function setDocLibraryPermissionAsAdmin(permission: RoleAssignmentBody, library: Library): Promise<void> {
  await authenticateAsAdmin();
  await browser.execute(
    async (permission, library) => {
      await window.setLibraryPermission(library, permission);
    },
    permission,
    library
  );
}
