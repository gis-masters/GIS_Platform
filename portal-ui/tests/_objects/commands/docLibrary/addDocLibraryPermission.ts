import { setLibraryPermission } from '../../../../src/app/services/data/docLibrary/docLibrary.service';
import { RoleAssignmentBody } from '../../../../src/app/services/data/permissions/permissions.models';
import { DocumentLibrary } from '../../../../src/app/services/data/docLibrary/docLibrary.models';
import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  setLibraryPermission: typeof setLibraryPermission;
};

export async function setDocLibraryPermissionAsAdmin(
  permission: RoleAssignmentBody,
  library: DocumentLibrary
): Promise<void> {
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
