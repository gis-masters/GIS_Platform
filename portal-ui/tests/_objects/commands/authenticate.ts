import { Given } from '@wdio/cucumber-framework';

import { AuthenticationResult, authService } from '../../../src/app/services/auth.service';
import { createTestOrganization } from './createOrganization';
import { sleep } from '../../../src/app/services/util/sleep';
import { createTestUsers } from './createUser';
import { homePage } from '../pages/Home.page';
import { testUsers } from './testUsers';
import { Page } from '../Page';

declare const window: { authService: typeof authService };

async function authenticate(login: string, password: string, thenPage?: Page): Promise<AuthenticationResult> {
  const currentUrl = await browser.getUrl();
  if (!currentUrl || currentUrl === 'data:,') {
    await homePage.open();
  }

  const result: AuthenticationResult = await browser.executeAsync<AuthenticationResult, [string, string]>(
    async (username, password, callback) => {
      callback(await window.authService.authenticate({ username, password }));
    },
    login,
    password
  );

  if (result.ok) {
    await (thenPage ? thenPage.open() : browser.refresh());
  }

  return result;
}

export async function authenticateAsAdmin(thenPage?: Page): Promise<void> {
  const { email, password } = testUsers.admin;
  const { ok } = await authenticate(email, password, thenPage);

  if (ok) {
    return;
  }
  const [notFirstTime] = await browser.getCookies('TEST_createdOrganization');
  if (notFirstTime) {
    return;
  }

  await browser.setCookies({ name: 'TEST_createdOrganization', value: '1' });

  const created = await createTestOrganization(browser);

  if (created) {
    for (let i = 0; i < 10; i++) {
      await sleep(5000);
      const { ok } = await authenticate(email, password, thenPage);
      if (ok) {
        break;
      }
    }
  } else {
    throw new Error('Не удалось создать организацию');
  }
}

export async function authenticateAsOwner(thenPage?: Page): Promise<void> {
  await authenticateAsUser(testUsers.owner, thenPage);
}

export async function authenticateAsContributor(thenPage?: Page): Promise<void> {
  await authenticateAsUser(testUsers.contributor, thenPage);
}

export async function authenticateAsViewer(thenPage?: Page): Promise<void> {
  await authenticateAsUser(testUsers.viewer, thenPage);
}

async function authenticateAsUser(
  { email, password }: typeof testUsers[keyof typeof testUsers],
  thenPage?: Page
): Promise<void> {
  const { ok } = await authenticate(email, password, thenPage);
  if (!ok) {
    await authenticateAsAdmin();
    await createTestUsers();
    await authenticate(email, password, thenPage);
  }
}

Given(/я авторизован как "(.*)"/, async (user: keyof typeof testUsers) => {
  await authenticateAsUser(testUsers[user]);
});
