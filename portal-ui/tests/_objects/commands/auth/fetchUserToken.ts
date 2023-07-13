import { TestUser } from './testUsers';
import { getUserToken } from './getUserToken';
import { createTestOrganizations } from './createTestOrganizations';

let retries = 0;
const MAX_AUTH_RETRIES = 5;
const AUTH_RETRY_DELAY = 1000;

export async function fetchUserToken(user: TestUser, suppressOrganizationCreation = false): Promise<void> {
  if (user.token) {
    return;
  }

  try {
    user.token = await getUserToken(user);
    retries = 0;
  } catch {
    retries++;
    await browser.pause(AUTH_RETRY_DELAY);
    if (retries > MAX_AUTH_RETRIES) {
      throw new Error(`Не удаётся получить токен пользователя "${user.email}"`);
    }

    if (!suppressOrganizationCreation) {
      await createTestOrganizations();
    }

    await browser.pause(AUTH_RETRY_DELAY);

    await fetchUserToken(user, true);
  }
}
