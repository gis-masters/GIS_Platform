import { PropertyType, Schema } from '../schema/schema.models';

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
  type: TaskType;
  ownerId: number;

  id?: number;
  status?: TaskStatus;
  assignedTo?: number;
  description?: string;
  dueDate?: string;
}

export interface TaskHistory {
  createdAt: string;
  eventType: string;
  id: number;
  massage: Task;
  taskId: number;
}

export const taskSchema: Schema = {
  name: 'tasks',
  title: 'Задачи',
  properties: [
    {
      propertyType: PropertyType.INT,
      name: 'id',
      title: 'Идентификатор',
      hidden: true
    },
    {
      propertyType: PropertyType.CHOICE,
      name: 'type',
      title: 'Тип задачи',
      required: true,
      options: [
        { title: 'Назначаемая', value: TaskType.ASSIGNABLE },
        { title: 'Настраиваемая', value: TaskType.CUSTOM },
        { title: 'Системная', value: TaskType.SYSTEM }
      ]
    },
    {
      propertyType: PropertyType.CHOICE,
      name: 'status',
      title: 'Статус задачи',
      hidden: true,
      options: [
        { title: 'Выполнена', value: TaskStatus.DONE },
        { title: 'Отменена', value: TaskStatus.CANCELED },
        { title: 'Создана', value: TaskStatus.CREATED },
        { title: 'В работе', value: TaskStatus.IN_PROGRESS }
      ]
    },
    {
      propertyType: PropertyType.STRING,
      name: 'description',
      title: 'Описание'
    },
    {
      propertyType: PropertyType.USER_ID,
      name: 'ownerId',
      title: 'Начальник',
      required: true
    },
    {
      propertyType: PropertyType.USER_ID,
      name: 'assignedTo',
      title: 'Исполнитель'
    },
    {
      propertyType: PropertyType.DATETIME,
      name: 'dueDate',
      title: 'Срок исполнения'
    }
  ]
};
