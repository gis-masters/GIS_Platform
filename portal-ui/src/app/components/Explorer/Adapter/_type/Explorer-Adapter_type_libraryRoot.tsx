import React, { ReactNode } from 'react';

import { Library } from '../../../Icons/Library';
import { PageOptions, SortOrder } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import {
  DocumentLibrary,
  getLibraries,
  getLibrariesWithParticularOne,
  getLibrary,
  LibraryRecord
} from '../../../../services/data/doc-library.service';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerStore } from '../../Explorer.store';
import { ExplorerService } from '../../Explorer.service';

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
    return 'Библиотеки документов';
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
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<DocumentLibrary>[], number]> {
    const [libraries, pagesCount] = await getLibraries({
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    return [libraries.map(payload => ({ type: ExplorerItemType.LIBRARY, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, page, ...options }: PageOptions,
    tableName: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<DocumentLibrary>[], number, number]> | undefined {
    const response = await getLibrariesWithParticularOne(tableName, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store),
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
        label: 'Дате создания',
        value: 'createdAt'
      },
      {
        label: 'Названию',
        value: 'title'
      }
    ];
  }

  static async getChildById(
    item: ExplorerItemData<LibraryRecord>,
    id: string
  ): Promise<ExplorerItemData<DocumentLibrary>> {
    const payload = await getLibrary(id);

    return {
      type: ExplorerItemType.LIBRARY,
      payload
    };
  }

  static getChildrenSortDefaultValue(): string {
    return 'title';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.ASC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }
}
