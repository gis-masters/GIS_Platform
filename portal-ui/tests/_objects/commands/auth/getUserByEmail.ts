import { CrgUserRaw } from '../../../../src/app/services/auth/users/users.models';
import { requestAsAdmin } from '../requestAs';
import { _reqAllUsers } from '../../../../src/app/services/auth/users/users.client';

export async function getUserByEmail(email: string): Promise<CrgUserRaw> {
  const allUsers = await requestAsAdmin(_reqAllUsers);
  const result = allUsers.find(user => user.email === email);

  if (!result) {
    throw new Error(`Не найден пользователь с email ${email}`);
  }

  return result;
}
