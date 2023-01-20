import { authService, RegData } from '../../../src/app/services/auth/auth.service';
import { testUsers } from './testUsers';

declare const window: { authService: typeof authService };

export async function createOrganization(
  browser: WebdriverIO.Browser,
  { company, contactPhone, firstName, lastName, email, password, password_ }: RegData
): Promise<boolean> {
  return await browser.executeAsync<boolean, [RegData]>(
    async ({ company, contactPhone, firstName, lastName, email, password, password_ }, callback) => {
      try {
        await window.authService.registration({
          company,
          contactPhone,
          firstName,
          lastName,
          email,
          password,
          password_
        });
        callback(true);
      } catch {
        callback(false);
      }
    },
    { company, contactPhone, firstName, lastName, email, password, password_ }
  );
}

export async function createTestOrganization(browser: WebdriverIO.Browser): Promise<boolean> {
  return await createOrganization(browser, testUsers.admin);
}
