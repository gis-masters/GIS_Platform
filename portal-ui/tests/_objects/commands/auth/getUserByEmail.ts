import { usersService } from '../../../../src/app/services/auth/users/users.service';
import { CrgUser } from '../../../../src/app/services/auth/users/users.models';

declare const window: { usersService: typeof usersService };

export async function getUserByEmail(email: string): Promise<CrgUser> {
  const result = await browser.executeAsync<string | undefined, [string]>(async (email, callback) => {
    callback(JSON.stringify(await window.usersService.getByEmail(email)));
  }, email);

  if (!result) {
    throw new Error(`Не найден пользователь с email ${email}`);
  }

  return typeof result !== 'string' ? result : (JSON.parse(result) as CrgUser);
}
