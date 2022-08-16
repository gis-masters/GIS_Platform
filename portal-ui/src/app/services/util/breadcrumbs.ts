import { ReactNode } from 'react';
import { AxiosError } from 'axios';

import { getLibrary, getLibraryRecord, LibraryRecord } from '../data/doc-library.service';
import { BreadcrumbsItemData } from '../../components/Breadcrumbs/Item/Breadcrumbs-Item';
import { Toast } from '../../components/Toast/Toast';
import { services } from '../services';

export async function getLibraryItemBreadcrumbs<T>(
  item: LibraryRecord,
  HomeIcon: ReactNode
): Promise<BreadcrumbsItemData<T>[]> {
  const { libraryId, path } = item;
  const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
  const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'empty', 'empty']);
  const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', libraryId, 'empty', 'empty']);
  const library = await getLibrary(libraryId);

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

    const itemParentsBreadcrumbs = parentsInfo?.map(({ title }, index) => {
      const folders: (string | number)[] = [];
      for (let i = 0; i < index + 1; i++) {
        folders.push('folder', parentsInfo[i].id);
      }

      const folderPath = JSON.stringify([...libraryRootUrlItems, 'library', libraryId, ...folders, 'empty', 'empty']);

      return {
        title,
        url: `/data-management?path_dm=${folderPath}`
      };
    });

    return [...breadcrumbs, ...itemParentsBreadcrumbs];
  } catch (error) {
    const err = error as AxiosError;
    Toast.warn(`Ошибка получения документа. ${err.message}`);
    services.logger.warn(`Ошибка получения документа. ${err.message}`);

    return breadcrumbs;
  }
}
