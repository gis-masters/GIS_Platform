import { PageableResources } from '../../../server-types/common-contracts';
import { PageableResponse, PageOptions, PageQueryParams } from '../models';
import { cqlBuild } from '../util/cqlBuild';

export function preparePageOptions(
  { page, sort, sortOrder, filter, pageSize, queryParams = {} }: PageOptions,
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

export function getPayloadFromPageableResponse<T>(
  response: PageableResponse<T> | PageableResources<T>,
  withOldPageableResponse: boolean
): T[] {
  if (withOldPageableResponse) {
    const embedded = (response as PageableResponse<T>)._embedded;
    if (!embedded) {
      return [];
    }

    const key = Object.keys(embedded)[0];

    return embedded[key];
  }

  return (response as PageableResources<T>).content || [];
}

export function stringifyParams(params: Record<string, string | number>): Record<string, string> {
  const stringParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    stringParams[key] = String(value);
  }

  return stringParams;
}
