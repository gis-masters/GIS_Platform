import { Library } from '../../../../src/app/services/data/library/library.models';
import { setLibraryPermission } from '../../../../src/app/services/data/library/library.service';
import { RoleAssignmentBody } from '../../../../src/app/services/permissions/permissions.models';
import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  setLibraryPermission: typeof setLibraryPermission;
};

export async function setDocLibraryPermissionAsAdmin(permission: RoleAssignmentBody, library: Library): Promise<void> {
  await authenticateAsAdmin();
  await browser.executeAsync(
    async (permission, library, callback) => {
      await window.setLibraryPermission(library, permission);
      callback();
    },
    permission,
    library
  );
}
