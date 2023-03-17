import { authService } from '../../../../src/app/services/auth/auth/auth.service';
import { RegData } from '../../../../src/app/services/auth/auth/auth.models';

declare const window: { authService: typeof authService };

export async function createOrganization({
  company,
  contactPhone,
  firstName,
  lastName,
  email,
  password,
  password_
}: RegData): Promise<void> {
  return await browser.executeAsync(
    async ({ company, contactPhone, firstName, lastName, email, password, password_ }, callback) => {
      await window.authService.registration({
        company,
        contactPhone,
        firstName,
        lastName,
        email,
        password,
        password_
      });
      callback();
    },
    { company, contactPhone, firstName, lastName, email, password, password_ }
  );
}
