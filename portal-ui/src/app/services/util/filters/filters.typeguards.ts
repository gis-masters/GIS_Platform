import { isArray } from '../typeGuards/isArray';
import { type FilterQuery, type FilterQueryValue } from './filters.models';

export function isFilterQueryValue(value: unknown): value is FilterQueryValue {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value instanceof RegExp ||
    value === null
  ) {
    return true;
  }

  if (isArray(value)) {
    return value.every(isFilterQueryValue);
  }

  return false;
}

export function isFilterQuery(value: unknown): value is FilterQuery {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return Object.entries(value).every(
    ([_, val]) => isFilterQueryValue(val) || isFilterQuery(val) || (isArray(val) && val.every(isFilterQuery))
  );
}
