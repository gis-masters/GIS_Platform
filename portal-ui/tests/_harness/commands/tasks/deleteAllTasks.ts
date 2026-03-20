import { taskClient } from '../../../../src/app/services/data/task/task.client';
import { requestAsAdmin } from '../requestAs';

export async function deleteAllTasks(): Promise<void> {
  await requestAsAdmin(taskClient.deleteAllTask);
}
