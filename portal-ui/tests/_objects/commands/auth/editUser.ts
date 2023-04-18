import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { CrgUser } from '../../../../src/app/services/auth/users/users.models';
import { requestAsAdmin } from '../requestAs';

export async function editUser(patch: Partial<CrgUser>, id: number): Promise<void> {
  return await requestAsAdmin(usersClient.editUser.bind(usersClient), patch, id);
}
