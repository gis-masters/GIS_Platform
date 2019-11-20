import {FeatureDescription, PropertySchema} from './data-schema.service';

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

export interface Process {
  id: number;
  userName: string;
  title: string;
  status: ProcessStatus;
  type: ProcessType;
  extra: any;
  details: ProcessTasks[];
}

export interface ProcessTasks {
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
}

export enum ImportTargetType {
  AS_IS = 'AsIs',
  NOT_IMPORT = 'NotImport',
  FROM_SCHEMA = 'FromSchema'
}

export const AS_IS = {
  title: 'Импортировать как есть',
  name: ImportTargetType.AS_IS,
};

export const NOT_IMPORT = {
  title: 'Не импортировать',
  name: ImportTargetType.NOT_IMPORT,
};

export const IMPORT_LAYER_AS_IS = {
  name: 'IMPORT_LAYER_AS_IS',
  title: 'Импортировать как есть',
  description: '',
  tableName: 'IMPORT_LAYER_AS_IS',
  properties: []
} as FeatureDescription;

export const NOT_IMPORT_LAYER = {
  name: 'NOT_IMPORT_LAYER',
  title: 'Не импортировать',
  description: '',
  tableName: 'NOT_IMPORT_LAYER',
  properties: []
} as FeatureDescription;

export const LAYERS_GROUP = {
  name: 'Group',
  title: 'Группа слоёв',
  description: '',
  tableName: '',
  properties: []
} as FeatureDescription;
