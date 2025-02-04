import { Page } from '../Page';
import { HomePage } from '../pages/Home.page';
import { testUsers } from './testUsers';
import { createTestOrganization } from './createOrganization';
import { authService } from '../../../src/app/services/auth/auth/auth.service';
import { AuthenticationResult } from '../../../src/app/services/auth/auth/auth.models';
import { sleep } from '../../../src/app/services/util/sleep';
import { createTestUsers } from './createUser';

declare const window: { authService: typeof authService };

async function authenticate(
  browser: WebdriverIO.Browser,
  login: string,
  password: string,
  thenPage?: Page
): Promise<AuthenticationResult> {
  const currentUrl = await browser.getMeta('url');
  if (!currentUrl) {
    const homePage = new HomePage(browser);
    await homePage.open();
    await homePage.waitForVisible();
  }

  const result: AuthenticationResult = await browser.executeAsync(
    (username, password, callback) => {
      window.authService.authenticate({ username, password }).then(result => {
        callback({ ...result, ...{ username, password } });
      });
    },
    login,
    password
  );

  if (result.ok) {
    if (thenPage) {
      await thenPage.open();
    } else {
      await browser.refresh();
    }
  }

  return result;
}

export async function authenticateAsAdmin(browser: WebdriverIO.Browser, thenPage?: Page): Promise<void> {
  const { email, password } = testUsers.admin;
  const { ok } = await authenticate(browser, email, password, thenPage);

  if (ok) {
    return;
  }
  const notFirstTime = await browser.getMeta('createdOrganization');
  if (notFirstTime) {
    return;
  }

  await browser.setMeta('createdOrganization', 1);

  const created = await createTestOrganization(browser);

  if (created) {
    for (let i = 0; i < 10; i++) {
      await sleep(5000);
      const { ok } = await authenticate(browser, email, password, thenPage);
      if (ok) {
        break;
      }
    }
  } else {
    throw Error('Не удалось создать организацию');
  }
}

export async function authenticateAsOwner(browser: WebdriverIO.Browser, thenPage?: Page): Promise<void> {
  const { email, password } = testUsers.owner;
  await authenticateAsUser(browser, email, password, thenPage);
}

export async function authenticateAsContributor(browser: WebdriverIO.Browser, thenPage?: Page): Promise<void> {
  const { email, password } = testUsers.viewer;
  await authenticateAsUser(browser, email, password, thenPage);
}

export async function authenticateAsViewer(browser: WebdriverIO.Browser, thenPage?: Page): Promise<void> {
  const { email, password } = testUsers.contributor;
  await authenticateAsUser(browser, email, password, thenPage);
}

async function authenticateAsUser(
  browser: WebdriverIO.Browser,
  email: string,
  password: string,
  thenPage?: Page
): Promise<void> {
  const { ok } = await authenticate(browser, email, password, thenPage);
  if (!ok) {
    await authenticateAsAdmin(browser);
    await createTestUsers(browser);
    await authenticate(browser, email, password, thenPage);
  }
}
