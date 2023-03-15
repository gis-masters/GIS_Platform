import { CrgUser, usersService } from '../../../../src/app/services/auth/users.service';

declare const window: { usersService: typeof usersService };

export async function getUserByJob(job: string): Promise<CrgUser> {
  return await browser.executeAsync(async (job: string, callback) => {
    const allUsers = await window.usersService.getAll();

    const user = allUsers.find(({ job }) => job === job);
    if (!user) {
      throw new Error('Not found user: Чтец');
    }

    callback(user);
  }, job);
}
