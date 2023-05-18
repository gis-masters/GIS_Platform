import { FilterQuery, getFilterRootAnd } from '../../services/util/filterObjects';
import { getIdsFromPath } from '../DataManagement/DataManagement.utils';

export function getBreadcrumbsPathFromFilter(filter: FilterQuery): number[] {
  const [and, index] = getFilterRootAnd(filter || {}, 'path');
  let path: string;

  if (index !== -1) {
    path = (((and[index].$or as FilterQuery)[0] as FilterQuery).path as FilterQuery).$like as string;
  }

  if (Array.isArray(filter.$or) && (filter.$or[0] as FilterQuery).path) {
    path = ((filter.$or[0] as FilterQuery).path as FilterQuery)?.$like as string;
  }

  return getIdsFromPath(path);
}
