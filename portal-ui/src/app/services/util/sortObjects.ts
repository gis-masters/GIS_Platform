export interface SortParams<T> {
  field: keyof T;
  asc: boolean;
}

type CustomFieldsPrep<T, F extends keyof T> = (a: T[F]) => string | number;
export type CustomSortFieldsPrep<T> = { [key in keyof T]?: CustomFieldsPrep<T, key> };

function compare<T>(
  a: T,
  b: T,
  field: keyof T,
  asc: boolean,
  customFieldsPrep?: CustomSortFieldsPrep<T>,
  fallBackSortField?: keyof T
) {
  let fieldA: T[keyof T] | number | string = a[field];
  let fieldB: T[keyof T] | number | string = b[field];

  if (customFieldsPrep && customFieldsPrep[field]) {
    fieldA = customFieldsPrep[field](a[field]);
    fieldB = customFieldsPrep[field](b[field]);
  }

  let result = 0;

  if (fieldA > fieldB) {
    result = 1;
  } else if (fieldA < fieldB) {
    result = -1;
  }

  if (!asc) {
    result = -result;
  }

  return result || (fallBackSortField ? compare(a, b, fallBackSortField, asc, customFieldsPrep) : 0);
}

export function sortObjects<T>(
  arr: T[],
  field: keyof T,
  asc: boolean,
  fallBackSortField: keyof T,
  customFieldsPrep?: CustomSortFieldsPrep<T>
): T[] {
  return arr.slice().sort((a, b) => {
    return compare(a, b, field, asc, customFieldsPrep, fallBackSortField);
  });
}
