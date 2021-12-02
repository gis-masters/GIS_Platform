import React, { ReactNode } from 'react';

import { Library } from '../../../Icons/Library';
import { PageOptions, SortDir } from '../../../../services/models';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { staticImplements } from '../../../../services/util/staticImplements';
import { docLibraryService, DocumentLibrary, LibraryRecord } from '../../../../services/crg/doc-library.service';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerUrlItem } from '../../Explorer';

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
    const [libraries, pagesCount] = await docLibraryService.getLibraries(page, pageSize, sort, sortDir, filter);

    return [libraries.map(payload => ({ type: ExplorerItemType.LIBRARY, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    options: PageOptions,
    [, identifier, page]: ExplorerUrlItem
  ): Promise<[ExplorerItemData<DocumentLibrary>[], number, number]> | undefined {
    const response = await docLibraryService.getLibrariesWithParticularOne(identifier, {
      ...options,
      page
    });

    if (!response) {
      return;
    }

    const [libraries, totalPages, pageNumber] = response;

    return [libraries.map(payload => ({ type: ExplorerItemType.LIBRARY, payload })), totalPages, pageNumber];
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

  static async getChildById(
    item: ExplorerItemData<LibraryRecord>,
    id: string
  ): Promise<ExplorerItemData<DocumentLibrary>> {
    const payload = await docLibraryService.getLibrary(id);

    return {
      type: ExplorerItemType.LIBRARY,
      payload
    };
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
    return 'Фильтр по названию';
  }

  static getEmptyListView(): ReactNode | undefined {
    return <EmptyListView text='Библиотеки отсутствуют' />;
  }
}
