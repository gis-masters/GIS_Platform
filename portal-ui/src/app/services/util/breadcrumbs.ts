import { ReactNode } from 'react';
import { AxiosError } from 'axios';

import { getLibrary, getLibraryRecord, LibraryRecord } from '../data/doc-library.service';
import { BreadcrumbsItemData } from '../../components/Breadcrumbs/Item/Breadcrumbs-Item';
import { Toast } from '../../components/Toast/Toast';
import { services } from '../services';

export async function getLibraryItemBreadcrumbs<T>(
  item: LibraryRecord,
  HomeIcon: ReactNode,
  withCurrentItemFocus?: boolean
): Promise<BreadcrumbsItemData<T>[]> {
  const { libraryId, path, id, title, is_folder } = item;
  const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
  const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'empty', 'empty']);
  const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', libraryId, 'empty', 'empty']);
  const library = await getLibrary(libraryId);
  // eslint-disable-next-line camelcase
  const currentItem = is_folder ? ['folder', id] : ['doc', id];

  const breadcrumbs = [
    { title: HomeIcon, url: '/data-management' },
    {
      title: 'Библиотеки документов',
      url: `/data-management?path_dm=${libraryRootPath}`
    },
    {
      title: library.title,
      url: `/data-management?path_dm=${libraryPath}`
    }
  ];

  const documentPath = path.split('/');

  try {
    let parentsInfo = await Promise.all(
      documentPath.map(async (item, index) => {
        if (index > 1) {
          const record = await getLibraryRecord(libraryId, Number(item));

          return { title: record.title, id: record.id };
        }
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
