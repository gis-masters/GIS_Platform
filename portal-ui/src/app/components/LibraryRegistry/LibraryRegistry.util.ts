import { getFilterRootAnd } from '../../services/util/filters/filters';
import { type FilterQuery } from '../../services/util/filters/filters.models';
import { isArray } from '../../services/util/typeGuards/isArray';
import { getIdsFromPath } from '../DataManagement/DataManagement.utils';

export function getBreadcrumbsPathFromFilter(filter: FilterQuery): number[] {
  const [and, index] = getFilterRootAnd(filter || {}, 'path');
  let path: string | undefined;

  if (index !== -1 && and[index].$or) {
    path = (((and[index].$or as FilterQuery)[0] as FilterQuery).path as FilterQuery).$like as string;
  }

  if (filter.$or && isArray(filter.$or) && (filter.$or[0] as FilterQuery).path) {
    path = ((filter.$or[0] as FilterQuery).path as FilterQuery)?.$like as string;
  }

  return getIdsFromPath(path);
}
