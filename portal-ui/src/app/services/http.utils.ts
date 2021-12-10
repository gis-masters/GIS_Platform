import { PageableResponse, PageOptions, PageQueryParams } from './models';
import { buildCqlFilter } from './util/cql';

export function preparePageOptions(
  { page, sort, sortDir, filter, pageSize, queryParams = {} }: PageOptions,
  useCQL = false
): PageQueryParams {
  if (useCQL && filter) {
    filter = { filter: buildCqlFilter(filter) };
  }

  return { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}), ...queryParams };
}

export function getPayloadFromPageableResponse<T>(response: PageableResponse<T>): T[] {
  if (!response._embedded) {
    return [];
  }

  const key = Object.keys(response._embedded)[0];

  return response._embedded[key];
}
