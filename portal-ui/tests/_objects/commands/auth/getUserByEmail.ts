import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { CrgUserRaw } from '../../../../src/app/services/auth/users/users.models';
import { requestAs } from '../requestAs';
import { getTestUser } from './testUsers';

export async function getUserByEmail(
  email: string,
  orgAdmin = getTestUser('Администратор организации')
): Promise<CrgUserRaw> {
  const allUsers = await requestAs(orgAdmin, usersClient.getAllUsers);
  const result = allUsers.find(user => user.email === email);

  if (!result) {
    throw new Error(`Не найден пользователь с email ${email}`);
  }

  return result;
}
