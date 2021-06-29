import React, { ReactNode } from 'react';

import { Library } from '../../../Icons/Library';
import { PageOptions, SortDir } from '../../../../services/models';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { staticImplements } from '../../../../services/util/staticImplements';
import { docLibraryService, DocumentLibrary } from '../../../../services/crg/doc-library.service';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.LIBRARY_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeLibraryRoot {
  static getId(): string {
    return 'libraryRoot';
  }

  static getTitle(): string {
    return 'Библиотеки';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <Library color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<DocumentLibrary>[], number]> {
    const [libraries, pagesCount] = await docLibraryService.getAllLibraries(page, pageSize, sort, sortDir, filter);

    return [libraries.map(payload => ({ type: ExplorerItemType.LIBRARY, payload })), pagesCount];
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'title'
      },
      {
        label: 'Дате создания',
        value: 'createdAt'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'createdAt';
  }

  static getChildrenSortDefaultDirection(): SortDir {
    return SortDir.DESC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Поиск по названию';
  }

  static getEmptyListView(): ReactNode | undefined {
    return <EmptyListView text='Библиотеки отсутствуют' />;
  }
}
