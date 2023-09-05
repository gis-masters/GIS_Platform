export enum TaskType {
  ASSIGNABLE = 'ASSIGNABLE',
  SYSTEM = 'SYSTEM',
  CUSTOM = 'CUSTOM'
}

export enum TaskStatus {
  DONE = 'DONE',
  CREATED = 'CREATED',
  CANCELED = 'CANCELED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export interface Task {
  owner_id: number;
  content_type_id: string;
  assigned_to: number;

  type?: TaskType;
  id?: number;
  status?: TaskStatus;
  description?: string;
  dueDate?: string;
  last_modified?: string;
}

export interface TaskHistory {
  id: number;
  taskId: number;
  eventType: string;
  createdAt: string;
  massage: Task;
}
