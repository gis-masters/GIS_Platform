import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { CrgUser } from '../../../../src/app/services/auth/users/users.models';
import { requestAsAdmin } from '../requestAs';

export async function updateUser(userId: number, value: Partial<CrgUser>): Promise<void> {
  await requestAsAdmin(usersClient.editUser, value, userId);
}
