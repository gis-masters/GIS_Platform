import { PageableResponse, PageOptions, PageQueryParams } from './models';
import { buildCqlFilter } from './util/cql';

export function preparePageOptions(
  { page, sort, sortDir, filter, pageSize, queryParams = {} }: PageOptions,
  useCQL = false
): PageQueryParams {
  if (useCQL && filter && Object.keys(filter).length) {
    filter = { filter: buildCqlFilter(filter) };
  }

  return {
    page: String(page),
    size: String(pageSize),
    ...(sort ? { sort: `${sort},${sortDir}` } : {}),
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
