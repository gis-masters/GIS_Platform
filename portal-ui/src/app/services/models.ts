import { type ReactNode } from 'react';

import { type FilterQuery } from './util/filters/filters.models';

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
