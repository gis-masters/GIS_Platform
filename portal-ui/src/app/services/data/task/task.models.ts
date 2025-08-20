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
  id: number;

  owner_id: number;
  content_type_id: string;
  assigned_to: number;

  type?: TaskType;
  status?: TaskStatus;
  description?: string;
  dueDate?: string;
  created_at?: string;
  last_modified?: string;
}

export interface TaskHistory {
  id: number;
  taskId: number;
  eventType: string;
  createdAt: string;
  massage: Task;
}
