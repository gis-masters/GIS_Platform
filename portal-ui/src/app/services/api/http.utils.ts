import { PageOptions, PageQueryParams } from '../models';
import { buildCql } from '../util/cql/buildCql';

export function preparePageOptions(
  { page, sort, sortOrder, filter, pageSize, queryParams = {} }: PageOptions,
  useCQL = false
): PageQueryParams {
  if (useCQL && filter && Object.keys(filter).length) {
    filter = { filter: buildCql(filter) };
  }

  return {
    page: String(page),
    size: String(pageSize),
    ...(sort ? { sort: `${sort},${sortOrder}` } : {}),
    ...filter,
    ...queryParams
  };
}

export function stringifyParams(params: Record<string, string | number | undefined>): Record<string, string> {
  const stringParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    stringParams[key] = String(value);
  }

  return stringParams;
}
