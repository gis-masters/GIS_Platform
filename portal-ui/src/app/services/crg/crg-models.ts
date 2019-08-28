import {PropertySchema} from './data-schema.service';

export interface CrgModels {
  page?: Pageable;
  sort?: Sortable;
  filter?: FilterEvent[];
}

export interface Pageable {
  pageSize?: number;
  offset?: number;
  count?: number;
  limit?: number;
}

export interface Sortable {
  column?: any;
  sorts?: any;
  newValue?: string;
  prevValue?: string;
}

export interface FilterEvent {
  property?: PropertySchema;
  value?: string[];
}

export interface CrgProcess {
  id: number;
  userName: string;
  title: string;
  status: ProcessStatus;
  type: ProcessType;
  extra: any;
  details: CrgProcessTasks[];
}

export interface CrgProcessTasks {
  layerName: string;
  status: ProcessStatus;
  error: string;
}

// Править в соответствии с: ru/mycrg/common/enums/ProcessType.java
export enum ProcessType {
  CREATE_ORG = 'CREATE_ORG',
  CREATE_PROJECT = 'CREATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',

  IMPORT = 'IMPORT',
  VALIDATION = 'VALIDATION',
  EXPORT = 'EXPORT'
}

// Править в соответствии с: ru/mycrg/common/enums/ProcessStatus.java
export enum ProcessStatus {
  PENDING = 'PENDING',

  TASK_DONE = 'TASK_DONE',    // Завершена часть процесса (например: обработан один ресур из нескольких)
  TASK_ERROR = 'TASK_ERROR',  // Часть процесса завершилась неудачно

  DONE = 'DONE',
  ERROR = 'ERROR',

  EMPTY = 'EMPTY'
}
