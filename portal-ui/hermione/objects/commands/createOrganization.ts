import { authService } from '../../../src/app/services/auth/auth/auth.service';
import { RegData } from '../../../src/app/services/auth/auth/auth.models';
import { testUsers } from './testUsers';

declare const window: { authService: typeof authService };

export async function createOrganization(
  browser: WebdriverIO.Browser,
  { company, contactPhone, description, firstName, lastName, email, password, password_ }: RegData
): Promise<boolean> {
  return await browser.executeAsync(
    (company, contactPhone, description, firstName, lastName, email, password, password_, callback) => {
      window.authService
        .registration({
          company,
          contactPhone,
          description,
          firstName,
          lastName,
          email,
          password,
          password_
        })
        .then(() => {
          callback(true);
        })
        .catch(() => {
          callback(false);
        });
    },
    company,
    contactPhone,
    description,
    firstName,
    lastName,
    email,
    password,
    password_
  );
}

export async function createTestOrganization(browser: WebdriverIO.Browser): Promise<boolean> {
  return await createOrganization(browser, testUsers.admin);
}
