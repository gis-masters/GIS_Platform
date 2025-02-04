import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { Mime } from '../../util/Mime';
import { Task, TaskHistory, TaskStatus } from './task.models';

@boundClass
class TasksClient extends Client {
  private static _instance: TasksClient;
  static get instance(): TasksClient {
    return this._instance || (this._instance = new this());
  }

  private getTasksUrl(): string {
    return this.getDataUrl() + '/tasks';
  }

  private getTasksHistoryUrl(id: number): string {
    return this.getDataUrl() + `/task-log/${id}`;
  }

  private getAllTasksDeletionUrl(): string {
    return this.getTasksUrl() + '/all';
  }

  private getTaskUrl(id: number): string {
    return `${this.getTasksUrl()}/${id}`;
  }

  private getTaskStatusUrl(id: number, status: string): string {
    return `${this.getTasksUrl()}/${id}/${status}`;
  }

  async getTask(id: number): Promise<Task> {
    return await http.get(this.getTaskUrl(id));
  }

  async getTaskHistory(id: number): Promise<TaskHistory[]> {
    return await http.get(this.getTasksHistoryUrl(id));
  }

  async getTasks(pageOptions: PageOptions): Promise<PageableResources<Task>> {
    const params = preparePageOptions(pageOptions, true);

    return await http.get<PageableResources<Task>>(this.getTasksUrl(), { params });
  }

  async createTask(task: Task): Promise<Task> {
    return await http.post(this.getTasksUrl(), task, {
      headers: { 'Content-Type': Mime.JSON }
    });
  }

  async deleteAllTask(): Promise<void> {
    return await http.delete(this.getAllTasksDeletionUrl());
  }

  async updateTask(id: number, patch: Partial<Task>): Promise<void> {
    return await http.patch(this.getTaskUrl(id), patch);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<void> {
    let statusUrl: string | undefined;

    switch (status) {
      case TaskStatus.DONE: {
        statusUrl = 'done';
        break;
      }

      case TaskStatus.IN_PROGRESS: {
        statusUrl = 'in-progress';
        break;
      }

      case TaskStatus.CANCELED: {
        statusUrl = 'cancel';
        break;
      }
    }

    if (statusUrl === undefined) {
      throw new Error('Не указан статус задачи');
    }

    return await http.put(this.getTaskStatusUrl(id, statusUrl));
  }
}

export const taskClient = TasksClient.instance;
