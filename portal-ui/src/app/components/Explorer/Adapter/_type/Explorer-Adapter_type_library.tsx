import React, { ReactNode } from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';
import { LocalLibrary } from '@material-ui/icons';

import { SortDir } from '../../../../services/models';
import { Emitter } from '../../../../services/util/Emitter';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import {
  ContentTypeTypes,
  docLibraryService,
  DocumentLibrary,
  LibraryItem
} from '../../../../services/crg/doc-library.service';

import { ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.LIBRARY]: LibraryItem;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeLibrary {
  static getId(item: ExplorerItemData<LibraryItem>) {
    return `${item.type}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<LibraryItem>) {
    return item.payload.title;
  }

  static getDetails(item: ExplorerItemData<LibraryItem>) {
    return String(item.payload.details);
  }

  static getMeta(item: ExplorerItemData<LibraryItem>) {
    const { itemsCount, createdAt, identifier } = item.payload;
    moment.locale('ru');
    const date = createdAt ? `${moment(createdAt).format('LL')}` : '';
    const counter = itemsCount
      ? `${itemsCount} ${pluralize(Number(itemsCount), 'элемент', 'элемента', 'элементов')}, `
      : '';

    return `${counter} ${date} (${identifier})`;
  }

  static getIcon() {
    return <LocalLibrary htmlColor='#196b39' />;
  }

  static isFolder() {
    return true;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<DocumentLibrary>,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[ExplorerItemData<LibraryItem>[], number]> {
    const [libraryItems, pagesCount] = await docLibraryService.getAllRecords(
      explorerItem.payload.identifier,
      page,
      pageSize,
      sort,
      sortDir,
      filter
    );

    const { contentTypes } = await schemaService.getSchema(explorerItem.payload.schemaId);

    return [
      libraryItems.map(item => {
        item.library = explorerItem.payload.identifier;
        item.schemaId = explorerItem.payload.schemaId;

        const contentType = contentTypes.find(cType => cType.id === item.content_type_id);

        return {
          type:
            contentType && contentType.type === ContentTypeTypes.FOLDER
              ? ExplorerItemType.FOLDER
              : ExplorerItemType.DOCUMENT,
          payload: item
        };
      }),
      pagesCount
    ];
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'title'
      },
      {
        label: 'Дате создания',
        value: 'created_at'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    // На самом деле это не должно быть захардкожено, а должно браться из схемы.
    return 'created_at';
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

  static getToolbarActions(item: ExplorerItemData<DocumentLibrary>): ReactNode {
    return <CreateLibraryElement payload={item.payload} />;
  }

  static getEmptyListView(item: ExplorerItemData): ReactNode | undefined {
    return (
      <EmptyListView
        text='Отсутствуют элементы для отображения'
        secondaryText='Начните работу с создания новых разделов или файлов'
      />
    );
  }

  static getRefreshEmitters(item: ExplorerItemData): Emitter[] {
    return [communicationService.libraryItemsUpdated];
  }
}
