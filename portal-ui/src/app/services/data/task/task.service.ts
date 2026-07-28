import { communicationService } from '../../communication.service';
import { type PageOptions } from '../../models';
import { type Schema } from '../schema/schema.models';
import { schemaTemplateService } from '../schemaTemplate/schemaTemplate.service';
import { taskClient } from './task.client';
import { type Task, type TaskHistory, type TaskStatus } from './task.models';

export async function createTask(task: Task): Promise<void> {
  await taskClient.createTask(task);
  communicationService.taskUpdated.emit();
}

export async function getTask(id: number): Promise<Task> {
  return await taskClient.getTask(id);
}

export async function getTaskSchema(): Promise<Schema> {
  const template = await schemaTemplateService.getSchemaTemplate('tasks_schema_v1');

  return template.classRule;
}

export async function getTaskHistory(id: number): Promise<TaskHistory[]> {
  return await taskClient.getTaskHistory(id);
}

export async function getTasks(pageOptions: PageOptions): Promise<[Task[], number]> {
  const response = await taskClient.getTasks(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function updateTask(id: number, patch: Partial<Task>): Promise<void> {
  await taskClient.updateTask(id, patch);
  communicationService.taskUpdated.emit();
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<void> {
  await taskClient.updateTaskStatus(id, status);
  communicationService.taskUpdated.emit();
}
