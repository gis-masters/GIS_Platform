import { OrganizationsListItemInfo } from '../../../../src/app/services/auth/auth/auth.models';
import { authClient } from '../../../../src/app/services/auth/auth/auth.client';
import { authenticateAs } from './authenticate';
import { TestUser } from './testUsers';

let retries = 0;
const MAX_AUTH_RETRIES = 3;

export async function fetchUserToken(user: TestUser): Promise<string> {
  if (user.token) {
    return user.token;
  }

  let token: string | OrganizationsListItemInfo[];

  try {
    token = await authClient.authenticate({ username: user.email, password: user.password });
    retries = 0;
  } catch {
    retries++;
    if (retries > MAX_AUTH_RETRIES) {
      throw new Error(`Не удаётся получить токен пользователя "${user.email}"`);
    }
    await authenticateAs(user);
    token = await fetchUserToken(user);
  }

  if (typeof token === 'string') {
    user.token = token;
  } else {
    throw new TypeError('К выбору организации мы пока не готовы');
  }

  return user.token;
}
