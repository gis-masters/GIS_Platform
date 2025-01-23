export type FilterQueryValue = string | number | boolean | RegExp | FilterQueryValue[] | null;

export interface FilterQuery {
  [key: string]: FilterQueryValue | FilterQuery | FilterQuery[];
}

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

  if (Array.isArray(value)) {
    return value.every(isFilterQueryValue);
  }

  return false;
}

export function isFilterQuery(value: unknown): value is FilterQuery {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return Object.entries(value).every(
    ([_, val]) => isFilterQueryValue(val) || isFilterQuery(val) || (Array.isArray(val) && val.every(isFilterQuery))
  );
}
