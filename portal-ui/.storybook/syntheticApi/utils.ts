import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { type PageOptions, type SortOrder } from '../../src/app/services/models';
import { parseCql } from '../../src/app/services/util/cql/parseCql';
import { filterObjects } from '../../src/app/services/util/filters/filterObjects';
import { queryObjects } from '../../src/app/services/util/queryObjects';
import { isRecordStringUnknown } from '../../src/app/services/util/typeGuards/isRecordStringUnknown';
import { type PageableResources } from '../../src/server-types/common-contracts';

export function err404(config: InternalAxiosRequestConfig): AxiosError {
  return new AxiosError('not found', 'forbidden', config, null, {
    config,
    status: 404,
    statusText: 'not found',
    data: {},
    headers: {}
  });
}

export function getQueryParams(config: InternalAxiosRequestConfig): Record<string, unknown> {
  return isRecordStringUnknown(config.params) ? config.params : {};
}

export function parseBody<T>(data: unknown): T {
  return JSON.parse(String(data)) as T;
}

export function parsePageOptions(config: InternalAxiosRequestConfig): PageOptions {
  const pageOptions: Partial<PageOptions> = {
    page: 0,
    pageSize: 10
  };

  for (const [key, value] of Object.entries(getQueryParams(config))) {
    if (key === 'page') {
      pageOptions.page = Number(value);
    }

    if (key === 'size') {
      pageOptions.pageSize = Number(value);
    }

    if (key === 'sort') {
      const [sort, sortOrder] = String(value).split(',');
      pageOptions.sort = sort;
      pageOptions.sortOrder = sortOrder as SortOrder;
    }

    if (key === 'filter') {
      pageOptions.filter = parseCql(String(value));
    }

    if (!pageOptions.queryParams) {
      pageOptions.queryParams = {};
    }
    pageOptions.queryParams[key] = String(value);
  }

  return pageOptions as PageOptions;
}

export function toPageable<T>(items: T[], pageOptions: PageOptions): PageableResources<T> {
  const page = pageOptions.page || 0;
  const pageSize = pageOptions.pageSize || 10;
  const filtered = pageOptions.filter ? filterObjects(items, pageOptions.filter) : items;
  const content = queryObjects(filtered, { ...pageOptions, filter: undefined, page, pageSize });
  const totalPages = Math.floor(filtered.length / pageSize) + Number(Boolean(filtered.length % pageSize));

  return {
    content,
    page: {
      size: pageSize,
      totalElements: filtered.length,
      totalPages,
      number: page
    }
  };
}
