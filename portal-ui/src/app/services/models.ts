import { ReactNode } from 'react';

import { OldSchema } from './data/schema/schemaOld.models';
import { GeometryType } from './geoserver/wfs/wfs.models';
import { FilterQuery } from './util/filters/filters.models';

export interface ApiLink {
  href: string;
  templated: boolean;
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

export const IMPORT_LAYER_AS_IS: OldSchema = {
  name: 'IMPORT_LAYER_AS_IS',
  title: 'Импортировать как есть',
  description: '',
  tableName: 'IMPORT_LAYER_AS_IS',
  geometryType: GeometryType.POINT,
  properties: []
};

export const NOT_IMPORT_LAYER: OldSchema = {
  name: 'NOT_IMPORT_LAYER',
  title: 'Не импортировать',
  description: '',
  tableName: 'NOT_IMPORT_LAYER',
  geometryType: GeometryType.POINT,
  properties: []
};

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface PageOptions {
  page: number;
  pageSize: number;
  totalPages?: number;
  sort?: string;
  sortOrder?: SortOrder;
  filter?: FilterQuery;
  queryParams?: { [key: string]: string | number };
}

export interface PageQueryParams {
  [key: string]: string | undefined;
  page: string;
  size: string;
  sort?: string;
}

export interface ChildrenProps {
  children?: ReactNode;
}

export type ValueOf<T> = T[keyof T];
