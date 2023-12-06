import React, { ReactNode } from 'react';
import { FolderOutlined } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { Emitter } from '../../../../services/common/Emitter';
import { formatDate } from '../../../../services/util/date.util';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { PageOptions, SortOrder } from '../../../../services/models';
import { schemaService } from '../../../../services/data/schema/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import {
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne
} from '../../../../services/data/library/library.service';
import { ContentTypeTypes, Library, LibraryRecord } from '../../../../services/data/library/library.models';
import { CreateLibraryRecord } from '../../../CreateLibraryRecord/CreateLibraryRecord';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';
import { LibraryDeletedDocumentsSwitch } from '../../../LibraryDeletedDocumentsSwitch/LibraryDeletedDocumentsSwitch';
import { LibraryViewSwitch } from '../../../LibraryViewSwitch/LibraryViewSwitch';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: LibraryRecord;
  }
}

@staticImplements<Adapter<LibraryRecord, LibraryRecord>>()
export class ExplorerAdapterTypeFolder {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<LibraryRecord>): string {
    return item.payload.title || '';
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
    const { libraryTableName, schemaId, id } = explorerItem.payload;

    const [libraryRecords, pagesCount] = await getLibraryRecords(libraryTableName, schemaId, {
      ...options,
      filter: service.mergeCustomFilter(filter || {}, explorerItem, store),
      queryParams: { parent: id }
    });

    const { contentTypes } = await schemaService.getSchema(schemaId);

    libraryRecords.forEach(record => {
      const contentType = contentTypes?.find(cType => cType.id === record.content_type_id);

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
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number] | undefined> {
    const response = await getLibraryRecordsWithParticularOne(
      item.payload.libraryTableName,
      item.payload.schemaId,
      Number(id),
      {
        ...options,
        filter: service.mergeCustomFilter(filter || {}, item, store),
        page,
        queryParams: { parent: item.payload.id }
      }
    );

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
    const payload = await getLibraryRecord(item.payload.libraryTableName, Number(recordId));
    const { contentTypes } = await schemaService.getSchema(item.payload.schemaId);
    const contentType = contentTypes?.find(cType => cType.id === payload.content_type_id);

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

  static async getToolbarActions(item: ExplorerItemData<LibraryRecord>, store: ExplorerStore): Promise<ReactNode> {
    const currentItem = await getLibraryRecord(item.payload.libraryTableName, item.payload.id);
    const createEnabled =
      currentUser.isAdmin ||
      (organizationSettings.createLibraryItem &&
        currentItem.role &&
        [Role.OWNER, Role.CONTRIBUTOR].includes(currentItem.role));
    const createHandler = (record: LibraryRecord, isFolder: boolean) => {
      store.selectItem({ payload: record, type: isFolder ? ExplorerItemType.FOLDER : ExplorerItemType.DOCUMENT });
    };
    const library = store.path.find(({ type }) => type === ExplorerItemType.LIBRARY)?.payload as Library;
    const path = store?.path
      .filter(({ type }) => type === ExplorerItemType.FOLDER)
      .map(({ payload }) => (payload as LibraryRecord).id);

    return (
      <>
        {createEnabled && <CreateLibraryRecord library={library} parent={currentItem} onCreate={createHandler} />}
        {store.explorerRole === 'dm' && (
          <>
            <LibraryDeletedDocumentsSwitch library={library} />
            <LibraryViewSwitch to='registry' library={library} path={path} />
          </>
        )}
      </>
    );
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

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<LibraryRecord>>[] {
    return [communicationService.libraryRecordUpdated];
  }
}
