import { cloneDeep } from 'lodash';

import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { FilterQuery, addFilterPart } from '../../services/util/filterObjects';

export const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];

export function getLibraryFolderExplorerUrl(libraryTableName: string, path: number[]): string {
  const urlPath = [
    ...libraryRootUrlItems,
    'library',
    libraryTableName,
    ...path.flatMap(id => ['folder', id]),
    'none',
    'none'
  ];

  return `/data-management?path_dm=${JSON.stringify(urlPath)}`;
}

export const registryDefaultFilter = { is_folder: { $in: [null, false] } };

export function getRegistryUrlWithFilter(libraryTableName: string, filter: FilterQuery): string {
  const url = new URL(location.href);
  const sortParamValue = url.searchParams.get('sort');
  const sortParam = sortParamValue ? `&sort=${sortParamValue}` : '';
  const filterParamValue = encodeURIComponent(JSON.stringify(filter));

  return `/data-management/library/${libraryTableName}/registry?filter=${filterParamValue}${sortParam}`;
}

export function getRegistryUrlWithPath(
  libraryTableName: string,
  pathIds: number[],
  filter: FilterQuery = registryDefaultFilter
): string {
  const filterWithPath = cloneDeep(filter);
  addFilterPart(filterWithPath, getPathFilter(pathIds));

  return getRegistryUrlWithFilter(libraryTableName, filterWithPath);
}

export function getIdsFromPath(path: string): number[] {
  return (path || '').replace(/%/g, '').split('/').map(Number).filter(notFalsyFilter);
}

export function getPathFilter(pathIds: number[]): FilterQuery {
  return { $or: [{ path: { $like: getPathPatternFromIds(pathIds) } }, { path: { $eq: getPathFromIds(pathIds) } }] };
}

function getPathPatternFromIds(path: number[]): string {
  return `${getPathFromIds(path)}/%`;
}

function getPathFromIds(path: number[]): string {
  return `/root${path.length ? '/' : ''}${path.join('/')}`;
}
