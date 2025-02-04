import { taskClient } from '../../../../src/app/services/data/task/task.client';
import { Task } from '../../../../src/app/services/data/task/task.models';
import { getUserByEmail } from '../auth/getUserByEmail';
import { TestUser } from '../auth/testUsers';
import { requestAs } from '../requestAs';

export async function createTask(user: TestUser, boss: TestUser, contentType: string): Promise<Task> {
  const bossUser = await getUserByEmail(boss.email);
  const subordinate = await getUserByEmail(user.email);

  // т.к. с морды нельзя создать задачу то используем захардкоженные данные для теста
  const task = {
    content_type_id: contentType,
    owner_id: bossUser.id,
    assigned_to: subordinate.id,
    inbox_data_key_data_connection:
      '[{"id":5,"title":"Arbustum","libraryTableName":"dl_data_documents_with_simple_content_type"}]'
  } as unknown as Task;

  return await requestAs(user, taskClient.createTask, task);
}
