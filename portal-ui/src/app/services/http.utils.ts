import { PageableResponse, PageOptions, PageQueryParams } from './models';

export function preparePageOptions({ page, sort, sortDir, filter, pageSize }: PageOptions): PageQueryParams {
  return { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) };
}

export function getPayloadFromPageableResponse<T>(response: PageableResponse<T>): T[] {
  if (!response._embedded) {
    return [];
  }

  const key = Object.keys(response._embedded)[0];

  return response._embedded[key];
}
