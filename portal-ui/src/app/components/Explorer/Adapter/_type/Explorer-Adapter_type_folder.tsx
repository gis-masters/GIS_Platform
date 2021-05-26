import React, { ReactNode } from 'react';
import moment from 'moment';
import { FolderOutlined } from '@material-ui/icons';

import { SortDir } from '../../../../services/models';
import { Emitter } from '../../../../services/util/Emitter';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import { ContentTypeTypes, docLibraryService, LibraryRecord } from '../../../../services/crg/doc-library.service';

import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFolder {
  static getId(item: ExplorerItemData<LibraryRecord>) {
    return `${item.type}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<LibraryRecord>) {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<LibraryRecord>) {
    const { details, created_at } = item.payload;
    moment.locale('ru');

    return (
      <>
        {details && <p>{details}</p>}

        {created_at && (
          <p>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(created_at).format('LL')}
          </p>
        )}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<LibraryRecord>) {
    return String(item.payload.id);
  }

  static getIcon() {
    return <FolderOutlined color='primary' />;
  }

  static isFolder() {
    return true;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<LibraryRecord>,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];

    const [libraryRecords, pagesCount] = await docLibraryService.getAllRecords(
      explorerItem.payload.libraryId,
      explorerItem.payload.schemaId,
      page,
      pageSize,
      sort,
      sortDir,
      { ...filter, parent: explorerItem.payload.id }
    );

    const { contentTypes } = await schemaService.getSchema(explorerItem.payload.schemaId);

    libraryRecords.forEach(record => {
      const contentType = contentTypes.find(cType => cType.id === record.content_type_id);

      result.push({
        type:
          contentType && contentType.type === ContentTypeTypes.FOLDER
            ? ExplorerItemType.FOLDER
            : ExplorerItemType.DOCUMENT,
        payload: record
      });
    });

    return [result, pagesCount];
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

  static getToolbarActions(item: ExplorerItemData<LibraryRecord>, store: ExplorerStore): ReactNode {
    return <CreateLibraryElement schemaId={item.payload.schemaId} parent={item.payload.id} store={store} />;
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
