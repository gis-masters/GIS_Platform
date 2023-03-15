import { Given } from '@wdio/cucumber-framework';

import { AuthenticationResult, authService, RegData } from '../../../../src/app/services/auth/auth.service';
import { createOrganization } from './createOrganization';
import { sleep } from '../../../../src/app/services/util/sleep';
import { getUserByEmail as getUserByEmail } from './getUserByEmail';
import { createTestUsers, createTestUsersInOtherOrganization } from './createUser';
import { homePage } from '../../pages/Home.page';
import { testUsers } from './testUsers';
import { Page } from '../../Page';
import { usersService } from '../../../../src/app/services/auth/users.service';
import { projectsPage } from '../../pages/Projects.page';
import { currentUser } from '../../../../src/app/stores/CurrentUser.store';

declare const window: {
  currentUser: typeof currentUser;
  authService: typeof authService;
  usersService: typeof usersService;
};

async function authenticate(
  login: string,
  password: string,
  thenPage: Page = projectsPage
): Promise<AuthenticationResult> {
  const currentUrl = await browser.getUrl();
  if (!currentUrl || currentUrl === 'data:,' || currentUrl === 'about:blank') {
    await homePage.open();
  }

  const isAlreadyAuthenticated = await browser.execute<boolean, [string]>(login => {
    return window.currentUser.login === login;
  }, login);

  if (isAlreadyAuthenticated) {
    return { ok: true };
  }

  const result: AuthenticationResult = await browser.executeAsync<AuthenticationResult, [string, string]>(
    async (username, password, callback) => {
      callback(await window.authService.authenticate({ username, password }));
    },
    login,
    password
  );

  if (result.ok) {
    await thenPage.open();
  }

  return result;
}

async function authenticateAsSomeAdmin(admin: RegData, thenPage?: Page): Promise<void> {
  const { email, password, company } = admin;
  const { ok } = await authenticate(email, password, thenPage);

  if (ok) {
    return;
  }
  const cookieKey = 'TEST_createdOrganization' + company;
  const [notFirstTime] = await browser.getCookies(cookieKey);
  if (notFirstTime) {
    return;
  }

  await browser.setCookies({ name: cookieKey, value: '1' });

  await createOrganization(admin);

  for (let i = 0; i < 10; i++) {
    await sleep(5000);
    const { ok } = await authenticate(email, password, thenPage);
    if (ok) {
      return;
    }
  }

  throw new Error('Не удалось создать организацию ' + company);
}

export async function authenticateAsAdmin(thenPage?: Page): Promise<void> {
  await authenticateAsSomeAdmin(testUsers['Администратор организации'], thenPage);
}

export async function authenticateAsOtherAdmin(thenPage?: Page): Promise<void> {
  await authenticateAsSomeAdmin(testUsers['Администратор другой организации'], thenPage);
}

export async function authenticateAsOwner(thenPage?: Page): Promise<void> {
  await authenticateAs(testUsers['Гарри'], thenPage);
}

export async function logout(): Promise<void> {
  await browser.execute(() => {
    void window.authService.logout();
  });
  await browser.pause(500); // перезагрузка страницы после logout
  await homePage.waitForVisible();
}

export async function authenticateAs(
  { email, password }: (typeof testUsers)[keyof typeof testUsers],
  thenPage?: Page
): Promise<void> {
  const { ok } = await authenticate(email, password, thenPage);
  if (!ok) {
    await authenticateAsAdmin();
    await createTestUsers();
    await authenticate(email, password, thenPage);
  }
}

Given(/^я авторизован как "(.*)"$/, async (user: keyof typeof testUsers) => {
  const testUser = testUsers[user];
  if (!testUser) {
    throw new Error(`Used unknown user: '${user}'`);
  }

  await authenticateAs(testUser);
});

Given(/^в другой организации существует пользователь "(.*)"$/, async (user: keyof typeof testUsers) => {
  await authenticateAsOtherAdmin();
  const result = await getUserByEmail(testUsers[user]?.email);

  if (!result) {
    await createTestUsersInOtherOrganization();
  }

  await logout();
});
