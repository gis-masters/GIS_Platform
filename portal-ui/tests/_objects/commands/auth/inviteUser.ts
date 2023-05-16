import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { requestAsAdmin } from '../requestAs';
import { getUserByEmail } from './getUserByEmail';
import { TestUser } from './testUsers';

export async function inviteUser(user: TestUser): Promise<void> {
  try {
    if (await getUserByEmail(user.email)) {
      // уже добавлен
      return;
    }
  } catch {}

  await requestAsAdmin(usersClient.inviteUser, user.email);
}
