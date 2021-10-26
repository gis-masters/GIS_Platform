import { OldFeatureDescription, OldPropertySchema } from './crg/schemaOld.models';
import { GeometryType } from './geoserver/wfs.models';

interface PageableLink {
  href: string;
  templated?: boolean;
}

export interface PageablePage {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageableResponse<T> {
  _embedded?: T;
  _links: PageableLink[] | { [key: string]: PageableLink };
  page: PageablePage;
}

export interface RequestAttribute {
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
  property?: OldPropertySchema;
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

// Править в соответствии с: src/main/java/ru/mycrg/data_service_contract/enums/ProcessType.java
export enum ProcessType {
  IMPORT = 'IMPORT',
  IMPORT_GML = 'IMPORT_GML',
  VALIDATION = 'VALIDATION',
  VALIDATION_REPORT = 'VALIDATION_REPORT',
  EXPORT = 'EXPORT'
}

// Править в соответствии с: ru/mycrg/common/enums/ProcessStatus.java
export enum ProcessStatus {
  PENDING = 'PENDING',

  TASK_DONE = 'TASK_DONE', // Завершена часть процесса (например: обработан один ресурс из нескольких)
  TASK_ERROR = 'TASK_ERROR', // Часть процесса завершилась неудачно

  DONE = 'DONE',
  ERROR = 'ERROR'
}

export enum ImportTargetType {
  AS_IS = 'AsIs',
  NOT_IMPORT = 'NotImport',
  FROM_SCHEMA = 'FromSchema'
}

export const AS_IS = {
  title: 'Импортировать как есть',
  name: ImportTargetType.AS_IS
};

export const NOT_IMPORT = {
  title: 'Не импортировать',
  name: ImportTargetType.NOT_IMPORT
};

export const IMPORT_LAYER_AS_IS: OldFeatureDescription = {
  name: 'IMPORT_LAYER_AS_IS',
  title: 'Импортировать как есть',
  description: '',
  tableName: 'IMPORT_LAYER_AS_IS',
  geometryType: GeometryType.POINT,
  properties: []
};

export const NOT_IMPORT_LAYER: OldFeatureDescription = {
  name: 'NOT_IMPORT_LAYER',
  title: 'Не импортировать',
  description: '',
  tableName: 'NOT_IMPORT_LAYER',
  geometryType: GeometryType.POINT,
  properties: []
};

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc'
}

export interface PageOptions {
  page: number;
  pageSize: number;
  sort?: string;
  sortDir?: SortDir;
  filter?: { [key: string]: string };
}

export interface GeoserverException {
  code: string;
  locator: string;
  text: string;
}
