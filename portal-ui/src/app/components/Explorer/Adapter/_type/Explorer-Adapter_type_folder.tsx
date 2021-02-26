import React, { ReactNode } from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';
import { FolderOutlined } from '@material-ui/icons';
import { communicationService } from '../../../../services/communication.service';
import { schemaService } from '../../../../services/crg/schema.service';

import { SortDir } from '../../../../services/models';
import {
  ContentTypeTypes,
  docLibraryService,
  DocumentLibrary,
  LibraryItem
} from '../../../../services/crg/doc-library.service';
import { Emitter } from '../../../../services/util/Emitter';
import { staticImplements } from '../../../../services/util/staticImplements';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFolder {
  static getId(item: ExplorerItemData<LibraryItem>) {
    return `${item.type}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<LibraryItem>) {
    return item.payload.title;
  }

  static getMeta(item: ExplorerItemData<LibraryItem>) {
    const { itemsCount, created_at, id } = item.payload;
    moment.locale('ru');
    const date = created_at ? `${moment(created_at).format('LL')}` : '';
    const counter = itemsCount
      ? `${itemsCount} ${pluralize(Number(itemsCount), 'элемент', 'элемента', 'элементов')}, `
      : '';

    return `${counter} ${date} (${id})`;
  }

  static getIcon() {
    return <FolderOutlined />;
  }

  static isFolder() {
    return true;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<LibraryItem>,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[ExplorerItemData<LibraryItem>[], number]> {
    const [libraryItems, pagesCount] = await docLibraryService.getAllRecords(
      explorerItem.payload.library,
      page,
      pageSize,
      sort,
      sortDir,
      { ...filter, parent: explorerItem.payload.id }
    );

    const { contentTypes } = await schemaService.getSchema(explorerItem.payload.schemaId);

    return [
      libraryItems.map(item => {
        item.library = explorerItem.payload.library;
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

  static getToolbarActions(item: ExplorerItemData<LibraryItem>): ReactNode {
    return <CreateLibraryElement payload={item.payload} parent={item.payload.id} />;
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
