import { sleep } from '../../../../src/app/services/util/sleep';
import { currentUser } from '../../../../src/app/stores/CurrentUser.store';
import { authService } from '../../../../src/app/services/auth/auth/auth.service';
import { usersService } from '../../../../src/app/services/auth/users/users.service';
import { AuthenticationResult, RegData } from '../../../../src/app/services/auth/auth/auth.models';
import { testDataPreparationPage } from '../../pages/TestDataPreparationPage.page';
import { createOrganization } from './createOrganization';
import { TestUser, getTestUser } from './testUsers';
import { homePage } from '../../pages/Home.page';
import { createTestUsers } from './createTestUsers';
import { Page } from '../../Page';

declare const window: {
  currentUser: typeof currentUser;
  authService: typeof authService;
  usersService: typeof usersService;
};

async function authenticate(
  login: string,
  password: string,
  thenPage: Page = testDataPreparationPage
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
  await authenticateAsSomeAdmin(getTestUser('Администратор организации'), thenPage);
}

export async function authenticateAsOtherAdmin(thenPage?: Page): Promise<void> {
  await authenticateAsSomeAdmin(getTestUser('Администратор другой организации'), thenPage);
}

export async function authenticateAs({ email, password }: TestUser, thenPage?: Page): Promise<void> {
  const { ok } = await authenticate(email, password, thenPage);
  if (!ok) {
    await authenticateAsAdmin();
    await createTestUsers();
    await authenticate(email, password, thenPage);
  }
}

export async function logout(): Promise<void> {
  await browser.execute(() => {
    void window.authService.logout();
  });
  await browser.pause(500); // перезагрузка страницы после logout
  await homePage.waitForVisible();
}
