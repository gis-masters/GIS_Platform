import { taskClient } from '../../../../src/app/services/data/task/task.client';
import { Task } from '../../../../src/app/services/data/task/task.models';
import { getUserByEmail } from '../auth/getUserByEmail';
import { TestUser } from '../auth/testUsers';
import { requestAsAdmin } from '../requestAs';

export async function createTask(user: TestUser, boss: TestUser, contentType: string): Promise<Task> {
  const bossUser = await getUserByEmail(boss.email);
  const subordinate = await getUserByEmail(user.email);

  return await requestAsAdmin(taskClient.createTask, {
    content_type_id: contentType,
    owner_id: bossUser.id,
    assigned_to: subordinate.id
  });
}
