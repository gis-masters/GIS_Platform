export interface SortParams<T> {
  field: keyof T;
  asc: boolean;
}

function compare<T>(a: T, b: T, { field, asc }: SortParams<T>, fallBackSortField?: keyof T): number {
  let fieldA: T[keyof T] | number | string = a[field];
  if (typeof fieldA === 'string') {
    fieldA = fieldA.toLowerCase();
  }
  let fieldB: T[keyof T] | number | string = b[field];
  if (typeof fieldB === 'string') {
    fieldB = fieldB.toLowerCase();
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

  return result || (fallBackSortField ? compare(a, b, { field: fallBackSortField, asc }) : 0);
}

export function sortObjects<T>(arr: T[], field: keyof T, asc: boolean, fallBackSortField?: keyof T): T[] {
  return [...arr].sort((a, b) => {
    return compare(a, b, { field, asc }, fallBackSortField);
  });
}
