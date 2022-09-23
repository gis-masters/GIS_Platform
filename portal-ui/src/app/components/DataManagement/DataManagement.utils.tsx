import React from 'react';
import { AxiosError } from 'axios';
import { HomeOutlined } from '@mui/icons-material';

import { services } from '../../services/services';
import { getLibrary, getLibraryRecord, LibraryRecord } from '../../services/data/doc-library.service';
import { BreadcrumbsItemData } from '../Breadcrumbs/Item/Breadcrumbs-Item';
import { FilterQuery } from '../../services/util/filterObjects';
import { Toast } from '../Toast/Toast';

const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];

export function getLibraryFolderExplorerUrl(libraryIdentifier: string, path: number[]): string {
  const urlPath = [
    ...libraryRootUrlItems,
    'library',
    libraryIdentifier,
    ...path.flatMap(id => ['folder', id]),
    'empty',
    'empty'
  ];

  return `/data-management?path_dm=${JSON.stringify(urlPath)}`;
}

export async function getLibraryRecordBreadcrumbs(
  item: LibraryRecord,
  withCurrentItemFocus?: boolean
): Promise<BreadcrumbsItemData[]> {
  const { libraryId, path, id, title, is_folder: isFolder } = item;
  const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'empty', 'empty']);
  const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', libraryId, 'empty', 'empty']);
  const library = await getLibrary(libraryId);
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
        const { id, title } = await getLibraryRecord(libraryId, pathId);

        return { id, title };
      })
    );

    parentsInfo = parentsInfo.filter(Boolean);

    let pathWithoutCurrent: string;
    const itemParentsBreadcrumbs = parentsInfo?.map((parent, index) => {
      const folders: (string | number)[] = [];
      for (let i = 0; i < index + 1; i++) {
        folders.push('folder', parentsInfo[i].id);
      }

      const folderPath = JSON.stringify([...libraryRootUrlItems, 'library', libraryId, ...folders, 'empty', 'empty']);

      if (withCurrentItemFocus) {
        pathWithoutCurrent = JSON.stringify([...libraryRootUrlItems, 'library', libraryId, ...folders, ...currentItem]);
      }

      return {
        title: parent.title,
        url: `/data-management?path_dm=${folderPath}`
      };
    });

    if (withCurrentItemFocus) {
      itemParentsBreadcrumbs.push({
        title,
        url: `/data-management?path_dm=${
          pathWithoutCurrent ?? JSON.stringify([...libraryRootUrlItems, 'library', libraryId, ...currentItem])
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

export function getRegistryUrlWithFilter(libraryIdentifier: string, filter: FilterQuery): string {
  const url = new URL(location.href);
  const sortParamValue = url.searchParams.get('sort');
  const sortParam = sortParamValue ? `&sort=${sortParamValue}` : '';
  const filterParamValue = encodeURIComponent(JSON.stringify(filter));

  return `/data-management/library/${libraryIdentifier}/registry?filter=${filterParamValue}${sortParam}`;
}

export function getRegistryUrlWithPath(
  libraryIdentifier: string,
  pathIds: number[],
  filter: FilterQuery = registryDefaultFilter
): string {
  const filterWithPath = {
    ...filter,
    path: { $ilike: getPathFromIds(pathIds) }
  };

  return getRegistryUrlWithFilter(libraryIdentifier, filterWithPath);
}

export function getIdsFromPath(path: string): number[] {
  return (path || '').replace(/%/g, '').split('/').map(Number).filter(Boolean);
}

export function getPathFromIds(path: number[]): string {
  return `/root${path.length ? '/' : ''}${path.join('/')}%`;
}
