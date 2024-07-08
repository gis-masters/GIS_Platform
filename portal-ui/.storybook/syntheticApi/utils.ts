import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { parseCql } from '../../src/app/services/util/cql/parseCql';
import { PageOptions, SortOrder } from '../../src/app/services/models';

export function err404(config: InternalAxiosRequestConfig) {
  return new AxiosError('not found', 'forbidden', config, null, {
    config,
    status: 404,
    statusText: 'not found',
    data: {},
    headers: {}
  });
}

export function parsePageOptions(config: InternalAxiosRequestConfig): PageOptions {
  const pageOptions: Partial<PageOptions> = {};

  for (const [key, value] of Object.entries(config.params)) {
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
