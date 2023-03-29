import { RegData } from '../../../../src/app/services/auth/auth/auth.models';
import { usersService } from '../../../../src/app/services/auth/users/users.service';
import { authenticateAs } from './authenticate';

declare const window: { usersService: typeof usersService };

export async function inviteUser(user: RegData, orgAdmin: RegData): Promise<void> {
  await authenticateAs(orgAdmin);
  await browser.executeAsync(async (userEmail: string, callback) => {
    await window.usersService.invite(userEmail);
    callback();
  }, user.email);
}
