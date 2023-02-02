import React, { ReactNode } from 'react';
import { LocalLibrary } from '@mui/icons-material';

import { currentUser } from '../../../../stores/CurrentUser.store';
import {
  ContentTypeTypes,
  DocumentLibrary,
  getLibrary,
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne,
  LibraryRecord
} from '../../../../services/data/doc-library.service';
import { Link } from '../../../Link/Link';
import { Emitter } from '../../../../services/common/Emitter';
import { Role } from '../../../../services/data/permissions.models';
import { PageOptions, SortOrder } from '../../../../services/models';
import { schemaService } from '../../../../services/data/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService, DataChangeEvent } from '../../../../services/communication.service';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateLibraryRecord } from '../../../CreateLibraryRecord/CreateLibraryRecord';
import { formatDate } from '../../../../services/util/date.util';

import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerService } from '../../Explorer.service';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.LIBRARY]: DocumentLibrary;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeLibrary {
  static getId(item: ExplorerItemData<DocumentLibrary>): string {
    return item.payload.table_name;
  }

  static getTitle(item: ExplorerItemData<DocumentLibrary>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<DocumentLibrary>): ReactNode {
    const { details, createdAt, schemaId } = item.payload;

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {formatDate(createdAt, 'LL')}
          </ExplorerInfoDescItem>
        )}

        {currentUser.isAdmin && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Схема:</ExplorerInfoDescTitle>
            <Link href={`/data-management?path_dm=%5B"r","root","sr","schemasRoot","schema","${schemaId}"%5D`}>
              {schemaId}
            </Link>
          </ExplorerInfoDescItem>
        )}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<DocumentLibrary>): string {
    return String(item.payload.table_name);
  }

  static getIcon(): ReactNode {
    return <LocalLibrary color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<DocumentLibrary>,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];

    const [libraryRecords, pagesCount] = await getLibraryRecords(
      explorerItem.payload.table_name,
      explorerItem.payload.schemaId,
      {
        ...options,
        filter: service.mergeCustomFilter(filter, explorerItem, store)
      }
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

  static async getChildById(
    item: ExplorerItemData<DocumentLibrary>,
    recordId: string
  ): Promise<ExplorerItemData<LibraryRecord>> {
    const payload = await getLibraryRecord(item.payload.table_name, Number(recordId));
    const { contentTypes } = await schemaService.getSchema(item.payload.schemaId);
    const contentType = contentTypes.find(cType => cType.id === payload.content_type_id);

    return {
      type:
        contentType && contentType.type === ContentTypeTypes.FOLDER
          ? ExplorerItemType.FOLDER
          : ExplorerItemType.DOCUMENT,
      payload
    };
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData<DocumentLibrary>,
    { filter, page, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number]> | undefined {
    const response = await getLibraryRecordsWithParticularOne(item.payload.table_name, item.payload.schemaId, id, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store),
      page
    });

    if (!response) {
      return;
    }

    const [records, totalPages, pageNumber] = response;
    const { contentTypes } = await schemaService.getSchema(item.payload.schemaId);

    return [
      records.map(payload => {
        const contentType = contentTypes.find(cType => cType.id === payload.content_type_id);

        return {
          type:
            contentType && contentType.type === ContentTypeTypes.FOLDER
              ? ExplorerItemType.FOLDER
              : ExplorerItemType.DOCUMENT,
          payload
        };
      }),
      totalPages,
      pageNumber
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'created_at';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.DESC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }

  static async getToolbarActions(
    item: ExplorerItemData<DocumentLibrary>,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ): Promise<ReactNode> {
    const currentItem = await getLibrary(item.payload.table_name);
    const enabled =
      currentUser.isAdmin ||
      (organizationSettings.createLibraryItem && currentItem.role && currentItem.role !== Role.VIEWER);
    const createHandler = (record: LibraryRecord, isFolder: boolean) => {
      store.selectItem({ payload: record, type: isFolder ? ExplorerItemType.FOLDER : ExplorerItemType.DOCUMENT });
    };

    return full && enabled && <CreateLibraryRecord library={item.payload} onCreate={createHandler} />;
  }

  static getRefreshEmitters(): Emitter<DataChangeEvent<LibraryRecord>>[] {
    return [communicationService.libraryRecordUpdated];
  }
}
