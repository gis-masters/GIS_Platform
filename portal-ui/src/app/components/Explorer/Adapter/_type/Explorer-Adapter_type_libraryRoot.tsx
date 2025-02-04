import React, { ReactNode } from 'react';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { Library } from '../../../../services/data/library/library.models';
import {
  getLibraries,
  getLibrariesWithParticularOne,
  getLibrary
} from '../../../../services/data/library/library.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { CreateLibrary } from '../../../CreateLibrary/CreateLibrary';
import { Library as LibraryIcon } from '../../../Icons/Library';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';

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
    return <LibraryIcon color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number]> {
    const [libraries, pagesCount] = await getLibraries({
      ...options,
      filter: service.mergeCustomFilter(filter || {}, item, store)
    });

    return [libraries.map(payload => ({ type: ExplorerItemType.LIBRARY, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, page, ...options }: PageOptions,
    tableName: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const response = await getLibrariesWithParticularOne(tableName, {
      ...options,
      filter: service.mergeCustomFilter(filter || {}, item, store),
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

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData> {
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

  static getToolbarActions(item: ExplorerItemData, store: ExplorerStore): ReactNode {
    if (currentUser.isAdmin && store.explorerRole === 'dm') {
      return <CreateLibrary />;
    }

    return null;
  }

  static hasSearch(): boolean {
    return true;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<Library>>[] {
    return [communicationService.libraryUpdated];
  }
}
