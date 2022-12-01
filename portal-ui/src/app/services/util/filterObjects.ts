import escapeStringRegexp from 'escape-string-regexp';
import sift from 'sift';

export type FilterQueryValue = string | number | boolean | (string | number | boolean)[] | RegExp | string[];

export interface FilterQuery {
  [key: string]: FilterQueryValue | FilterQuery | FilterQuery[];
}

export function filterObjects<T>(arr: T[], query: FilterQuery): T[] {
  return arr.filter(sift(prepareLike(query)));
}

export function prepareLike(query: FilterQuery): FilterQuery {
  const newQuery: FilterQuery = {};

  for (const [key, value] of Object.entries(query)) {
    if (key === '$like' && typeof value === 'string') {
      newQuery.$regex = new RegExp(`^${escapeStringRegexp(value).replace(/%/g, '.*').replace(/\\./g, '.')}$`);
    } else if (key === '$ilike' && typeof value === 'string') {
      newQuery.$regex = new RegExp(`^${escapeStringRegexp(value).replace(/%/g, '.*').replace(/\\./g, '.')}$`, 'i');
    } else if (typeof value === 'object' && key !== '$regex' && !Array.isArray(value) && value !== null) {
      newQuery[key] = prepareLike(value as FilterQuery);
    } else {
      newQuery[key] = value;
    }
  }

  return newQuery;
}
