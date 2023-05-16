import { CrgUserRaw } from '../../../../src/app/services/auth/users/users.models';
import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { requestAsAdmin } from '../requestAs';

export async function getUserByEmail(email: string): Promise<CrgUserRaw> {
  const allUsers = await requestAsAdmin(usersClient.allUsers);
  const result = allUsers.find(user => user.email === email);

  if (!result) {
    throw new Error(`Не найден пользователь с email ${email}`);
  }

  return result;
}
