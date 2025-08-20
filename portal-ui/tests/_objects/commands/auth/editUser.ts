import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { CrgUser } from '../../../../src/app/services/auth/users/users.models';
import { requestAs } from '../requestAs';
import { getTestUser } from './testUsers';

export async function editUser(patch: Partial<CrgUser>, id: number): Promise<void> {
  return await requestAs(getTestUser('Администратор организации'), usersClient.editUser, patch, id);
}
