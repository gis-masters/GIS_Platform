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
    } else if (Array.isArray(value) && ['$and', '$or'].includes(key)) {
      newQuery[key] = value.map(filterPart => prepareLike(filterPart as FilterQuery));
    } else {
      newQuery[key] = value;
    }
  }

  return newQuery;
}

export function getFieldFilterValue(
  filter: FilterQuery,
  field: string
): FilterQueryValue | FilterQuery | FilterQuery[] | undefined {
  if (Array.isArray(filter.$and)) {
    const entry: FilterQuery = (filter.$and as FilterQuery[]).find(filterEntry => filterEntry[field] !== undefined);

    if (entry) {
      return entry[field];
    }
  }

  return filter[field];
}

export function getFieldFilterPart(filter: FilterQuery, field: string): FilterQuery | undefined {
  const [and, index] = getFilterRootAnd(filter, field);
  if (index !== -1) {
    const entry: FilterQuery = and.find(
      filterEntry =>
        filterEntry[field] !== undefined ||
        (filterEntry.$or && filterEntry.$or[0] && (filterEntry.$or[0] as FilterQuery)[field]) !== undefined
    );

    if (entry) {
      return entry;
    }
  }

  if (
    filter[field] !== undefined ||
    (filter.$or && filter.$or[0] && (filter.$or[0] as FilterQuery)[field]) !== undefined
  ) {
    return filter;
  }
}

export function modifyFieldFilterValue(
  filter: FilterQuery,
  field: string,
  value?: FilterQueryValue | FilterQuery
): void {
  if (value === undefined) {
    removeFieldFilter(filter, field);
  } else {
    addFieldFilter(filter, field, value);
  }
}

export function getFilterRootAnd(filter: FilterQuery, field?: string): [FilterQuery[], number] {
  const and: FilterQuery[] | undefined = filter.$and as FilterQuery[];
  const index = and?.findIndex(
    entry =>
      entry[field] !== undefined || (entry.$or && entry.$or[0] && (entry.$or[0] as FilterQuery)[field]) !== undefined
  );

  return [and, index === undefined ? -1 : index];
}

export function removeFieldFilter(filter: FilterQuery, field: string): void {
  const [and, index] = getFilterRootAnd(filter, field);

  if (and) {
    if (index !== -1) {
      and.splice(index, 1);
      if (!and.length) {
        delete filter.$and;
      }
      if (and.length === 1) {
        Object.assign(filter, and[0]);
        delete filter.$and;
      }
    }
  } else {
    delete filter[field];
    if (filter.$or && filter.$or[field]) {
      delete filter.$or;
    }
  }
}

function addFieldFilter(filter: FilterQuery, field: string, value: FilterQueryValue | FilterQuery): void {
  const [and, index] = getFilterRootAnd(filter, field);
  if (and) {
    if (index !== -1) {
      and[index][field] = value;
    } else {
      and.push({ [field]: value });
    }
  } else if (filter[field] !== undefined || !Object.keys(filter).length) {
    filter[field] = value;
  } else {
    const newAndValue = [{ ...filter }, { [field]: value }];
    for (const oldField of Object.keys(filter)) {
      delete filter[oldField];
    }
    filter.$and = newAndValue;
  }
}

export function addFilterPart(filter: FilterQuery, part: FilterQuery): void {
  const [and] = getFilterRootAnd(filter);
  if (and) {
    and.push(part);
  } else {
    const newAndValue = Object.keys(filter).length ? [{ ...filter }, part] : [part];
    for (const oldField of Object.keys(filter)) {
      delete filter[oldField];
    }
    filter.$and = newAndValue;
  }
}
