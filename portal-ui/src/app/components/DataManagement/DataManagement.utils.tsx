import React from 'react';
import { HomeOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';
import { cloneDeep } from 'lodash';

import { services } from '../../services/services';
import { getLibrary, getLibraryRecord } from '../../services/data/docLibrary/docLibrary.service';
import { LibraryRecord } from '../../services/data/docLibrary/docLibrary.models';
import { BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { addFilterPart, FilterQuery } from '../../services/util/filterObjects';
import { Toast } from '../Toast/Toast';

const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];

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

export async function getLibraryRecordBreadcrumbs(
  item: LibraryRecord,
  includeSelf?: boolean
): Promise<BreadcrumbsItemData[]> {
  const { libraryTableName, path, id, title, is_folder: isFolder } = item;
  const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'none', 'none']);
  const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', libraryTableName, 'none', 'none']);
  const library = await getLibrary(libraryTableName);
  const currentItem = isFolder ? ['folder', id] : ['doc', id];

  const breadcrumbs = [
    { title: <HomeOutlined />, url: '/data-management' },
    {
      title: 'Библиотеки документов',
      url: `/data-management?path_dm=${libraryRootPath}`
    },
    {
      title: library.title,
      url: `/data-management?path_dm=${libraryPath}`
    }
  ];

  try {
    let parentsInfo = await Promise.all(
      getIdsFromPath(path).map(async pathId => {
        const { id, title } = await getLibraryRecord(libraryTableName, pathId);

        return { id, title };
      })
    );

    parentsInfo = parentsInfo.filter(Boolean);

    let pathWithoutCurrent: string;
    const itemParentsBreadcrumbs: BreadcrumbsItemData[] = parentsInfo?.map((parent, index) => {
      const folders: (string | number)[] = [];
      for (let i = 0; i < index + 1; i++) {
        folders.push('folder', parentsInfo[i].id);
      }

      const folderPath = JSON.stringify([
        ...libraryRootUrlItems,
        'library',
        libraryTableName,
        ...folders,
        'none',
        'none'
      ]);

      if (includeSelf) {
        pathWithoutCurrent = JSON.stringify([
          ...libraryRootUrlItems,
          'library',
          libraryTableName,
          ...folders,
          ...currentItem
        ]);
      }

      return {
        title: parent.title,
        url: `/data-management?path_dm=${folderPath}`
      };
    });

    if (includeSelf) {
      itemParentsBreadcrumbs.push({
        title: <b>{title}</b>,
        url: `/data-management?path_dm=${
          pathWithoutCurrent ?? JSON.stringify([...libraryRootUrlItems, 'library', libraryTableName, ...currentItem])
        }`
      });
    }

    return [...breadcrumbs, ...itemParentsBreadcrumbs];
  } catch (error) {
    const err = error as AxiosError;
    Toast.warn(`Ошибка получения документа. ${err.message}`);
    services.logger.warn(`Ошибка получения документа. ${err.message}`);

    return breadcrumbs;
  }
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
  return (path || '').replace(/%/g, '').split('/').map(Number).filter(Boolean);
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
