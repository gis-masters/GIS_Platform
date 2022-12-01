import { PageableResponse, PageOptions, PageQueryParams } from './models';
import { cqlBuild } from './util/cqlBuild';

export function preparePageOptions(
  { page, sort, sortOrder: sortOrder, filter, pageSize, queryParams = {} }: PageOptions,
  useCQL = false
): PageQueryParams {
  if (useCQL && filter && Object.keys(filter).length) {
    filter = { filter: cqlBuild(filter) };
  }

  return {
    page: String(page),
    size: String(pageSize),
    ...(sort ? { sort: `${sort},${sortOrder}` } : {}),
    ...filter,
    ...queryParams
  };
}

export function getPayloadFromPageableResponse<T>(response: PageableResponse<T>): T[] {
  if (!response._embedded) {
    return [];
  }

  const key = Object.keys(response._embedded)[0];

  return response._embedded[key];
}

export function stringifyParams(params: Record<string, string | number>): Record<string, string> {
  const stringParams = {};
  for (const [key, value] of Object.entries(params)) {
    stringParams[key] = String(value);
  }

  return stringParams;
}
