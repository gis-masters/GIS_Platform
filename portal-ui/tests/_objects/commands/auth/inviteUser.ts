import { Given } from '@wdio/cucumber-framework';

import { RegData } from '../../../../src/app/services/auth/auth/auth.models';
import { usersService } from '../../../../src/app/services/auth/users/users.service';
import { authenticateAs } from './authenticate';
import { getUserByEmail } from './getUserByEmail';
import { testUsers } from './testUsers';

declare const window: { usersService: typeof usersService };

export async function inviteUser(user: RegData, orgAdmin: RegData): Promise<void> {
  await authenticateAs(orgAdmin);
  await browser.executeAsync(async (userEmail: string, callback) => {
    await window.usersService.invite(userEmail);
    callback();
  }, user.email);
}

Given(
  /пользователь "(.*)" добавлен в организацию под руководством "(.*)"/,
  async (userName: keyof typeof testUsers, adminName: keyof typeof testUsers) => {
    const user = testUsers[userName];
    const admin = testUsers[adminName];

    await authenticateAs(admin);
    if (await getUserByEmail(user.email)) {
      // уже добавлен
      return;
    }

    await inviteUser(user, admin);
  }
);
