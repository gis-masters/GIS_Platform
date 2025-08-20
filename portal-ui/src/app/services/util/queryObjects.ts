import { PageOptions, SortOrder } from '../models';
import { filterObjects } from './filters/filterObjects';
import { sortObjects } from './sortObjects';

export function queryObjects<T>(arr: T[], { filter, sort, sortOrder, page, pageSize }: PageOptions): T[] {
  const filtered = filter ? filterObjects(arr, filter) : arr;
  const sorted = sort ? sortObjects(filtered, sort as keyof T, sortOrder === SortOrder.ASC) : filtered;

  return sorted.slice(page * pageSize, page * pageSize + pageSize);
}
