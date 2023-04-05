import { _reqInviteUser } from '../../../../src/app/services/auth/users/users.client';
import { requestAsAdmin } from '../requestAs';
import { getUserByEmail } from './getUserByEmail';
import { getTestUser } from './testUsers';

export async function inviteUser(username: string): Promise<void> {
  const user = getTestUser(username);

  try {
    if (await getUserByEmail(user.email)) {
      // уже добавлен
      return;
    }
  } catch {}

  await requestAsAdmin(_reqInviteUser, user.email);
}
