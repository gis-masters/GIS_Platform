import React, { ReactNode } from 'react';
import { FolderOutlined } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { Emitter } from '../../../../services/common/Emitter';
import { formatDate } from '../../../../services/util/date.util';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { Role } from '../../../../services/data/permissions.models';
import { PageOptions, SortOrder } from '../../../../services/models';
import { schemaService } from '../../../../services/data/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService, DataChangeEvent } from '../../../../services/communication.service';
import {
  ContentTypeTypes,
  DocumentLibrary,
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne,
  LibraryRecord
} from '../../../../services/data/doc-library.service';
import { CreateLibraryRecord } from '../../../CreateLibraryRecord/CreateLibraryRecord';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: LibraryRecord;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFolder {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<LibraryRecord>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<LibraryRecord>): ReactNode {
    const { details, created_at: createdAt } = item.payload;

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {formatDate(createdAt, 'LL')}
          </ExplorerInfoDescItem>
        )}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<LibraryRecord>): string {
    return String(item.payload.id);
  }

  static getIcon(): ReactNode {
    return <FolderOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static getActions(item: ExplorerItemData<LibraryRecord>): ReactNode {
    return (
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }: CommonDiRegistry) => (
          <LibraryDocumentActions document={item.payload} as='iconButton' hideOpen />
        )}
      </RegistryConsumer>
    );
  }

  static async getChildren(
    explorerItem: ExplorerItemData<LibraryRecord>,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];
    const { libraryId, schemaId, id } = explorerItem.payload;

    const [libraryRecords, pagesCount] = await getLibraryRecords(libraryId, schemaId, {
      ...options,
      filter: service.mergeCustomFilter(filter, explorerItem, store),
      queryParams: { parent: id }
    });

    const { contentTypes } = await schemaService.getSchema(schemaId);

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

  static async getChildrenWithParticularOne(
    item: ExplorerItemData<LibraryRecord>,
    { filter, page, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number]> | undefined {
    const response = await getLibraryRecordsWithParticularOne(item.payload.libraryId, item.payload.schemaId, id, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store),
      page,
      queryParams: { parent: item.payload.id }
    });

    if (!response) {
      return;
    }

    const [records, totalPages, pageNumber] = response;

    const { contentTypes } = await schemaService.getSchema(item.payload.schemaId);

    return [
      records.map(payload => {
        const contentType = contentTypes?.find(cType => cType.id === payload.content_type_id);

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
    item: ExplorerItemData<LibraryRecord>,
    recordId: string
  ): Promise<ExplorerItemData<LibraryRecord>> {
    const payload = await getLibraryRecord(item.payload.libraryId, Number(recordId));
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
    item: ExplorerItemData<LibraryRecord>,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ): Promise<ReactNode> {
    const currentItem = await getLibraryRecord(item.payload.libraryId, item.payload.id);
    const createEnabled =
      currentUser.isAdmin ||
      (organizationSettings.createLibraryItem && [Role.OWNER, Role.CONTRIBUTOR].includes(currentItem.role));
    const createHandler = (record: LibraryRecord, isFolder: boolean) => {
      store.selectItem({ payload: record, type: isFolder ? ExplorerItemType.FOLDER : ExplorerItemType.DOCUMENT });
    };

    return (
      full &&
      createEnabled && (
        <CreateLibraryRecord
          library={store.path.find(({ type }) => type === ExplorerItemType.LIBRARY).payload as DocumentLibrary}
          parent={currentItem}
          onCreate={createHandler}
        />
      )
    );
  }

  static getRefreshEmitters(): Emitter<DataChangeEvent<LibraryRecord>>[] {
    return [communicationService.libraryRecordUpdated];
  }
}
