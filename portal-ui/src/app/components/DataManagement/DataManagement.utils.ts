import { cloneDeep } from 'lodash';

import { LibraryRecord } from '../../services/data/library/library.models';
import { addFilterPart } from '../../services/util/filters/filters';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';

export const datasetRootUrlItems = ['r', 'root', 'dr', 'datasetRoot'];
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

export function getIdsFromPath(path?: string): number[] {
  return (path || '').replaceAll('%', '').split('/').map(Number).filter(notFalsyFilter);
}

export function getIdsFromFullPath(item: ExplorerItemData, path: ExplorerItemData[]): number[] {
  let pathIds: number[] = [];
  if (item.type === ExplorerItemType.LIBRARY) {
    pathIds = [];
  } else if (item.type === ExplorerItemType.FOLDER) {
    pathIds = path
      .filter(({ type }) => type === ExplorerItemType.FOLDER)
      .map(({ payload }) => (payload as LibraryRecord).id);
  } else {
    pathIds = [];
  }

  return pathIds;
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
