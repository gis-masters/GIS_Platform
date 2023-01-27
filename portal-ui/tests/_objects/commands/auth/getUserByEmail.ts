import { CrgUser, usersService } from '../../../../src/app/services/auth/users.service';

declare const window: { usersService: typeof usersService };

export async function getUserByEmail(email: string): Promise<CrgUser> {
  const result = await browser.executeAsync<string, [string]>(async (email, callback) => {
    callback(JSON.stringify(await window.usersService.getByEmail(email)));
  }, email);

  return JSON.parse(result) as CrgUser;
}
