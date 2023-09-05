import { requestAsAdmin } from '../requestAs';
import { taskClient } from '../../../../src/app/services/data/task/task.client';

export async function deleteAllTasks(): Promise<void> {
  await requestAsAdmin(taskClient.deleteAllTask);
}
