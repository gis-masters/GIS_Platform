import { CrgUser, usersService } from '../../../../src/app/services/auth/users.service';

declare const window: { usersService: typeof usersService };

export async function getUserByEmail(email: string): Promise<CrgUser | undefined> {
  const result = await browser.executeAsync<string | undefined, [string]>(async (email, callback) => {
    callback(JSON.stringify(await window.usersService.getByEmail(email)));
  }, email);

  return typeof result !== 'string' ? result : (JSON.parse(result) as CrgUser);
}
