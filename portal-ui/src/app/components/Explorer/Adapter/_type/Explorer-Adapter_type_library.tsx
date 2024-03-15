import React, { ReactNode } from 'react';
import { LocalLibrary } from '@mui/icons-material';

import { currentUser } from '../../../../stores/CurrentUser.store';
import {
  getLibrary,
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne
} from '../../../../services/data/library/library.service';
import { ContentTypeTypes, Library, LibraryRecord } from '../../../../services/data/library/library.models';
import { Emitter } from '../../../../services/common/Emitter';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { PageOptions, SortOrder } from '../../../../services/models';
import { schemaService } from '../../../../services/data/schema/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateLibraryRecord } from '../../../CreateLibraryRecord/CreateLibraryRecord';
import { formatDate } from '../../../../services/util/date.util';
import { LibraryViewSwitch } from '../../../LibraryViewSwitch/LibraryViewSwitch';
import { LibraryDeletedDocumentsSwitch } from '../../../LibraryDeletedDocumentsSwitch/LibraryDeletedDocumentsSwitch';
import { LibraryKptRequest } from '../../../LibraryKptRequest/LibraryKptRequest';

import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerService } from '../../Explorer.service';
import { LibraryActions } from '../../../LibraryActions/LibraryActions';

@staticImplements<Adapter<Library, LibraryRecord>>()
export class ExplorerAdapterTypeLibrary {
  static getId(item: ExplorerItemData<Library>): string {
    return item.payload.table_name;
  }

  static getTitle(item: ExplorerItemData<Library>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<Library>): ReactNode {
    const { details, createdAt } = item.payload;

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

  static getMeta(item: ExplorerItemData<Library>): string {
    return String(item.payload.table_name);
  }

  static getIcon(): ReactNode {
    return <LocalLibrary color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static getActions(item: ExplorerItemData<Library>): ReactNode {
    return <LibraryActions library={item.payload} />;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<Library>,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];

    const [libraryRecords, pagesCount] = await getLibraryRecords(explorerItem.payload.table_name, {
      ...options,
      filter: service.mergeCustomFilter(filter, explorerItem, store)
    });

    const { contentTypes } = await schemaService.getSchema(explorerItem.payload.schema.name);

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
    item: ExplorerItemData<Library>,
    recordId: string
  ): Promise<ExplorerItemData<LibraryRecord>> {
    const payload = await getLibraryRecord(item.payload.table_name, Number(recordId));
    const { contentTypes } = item.payload.schema;
    const contentType = contentTypes?.find(cType => cType.id === payload.content_type_id);

    return {
      type:
        contentType && contentType.type === ContentTypeTypes.FOLDER
          ? ExplorerItemType.FOLDER
          : ExplorerItemType.DOCUMENT,
      payload
    };
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData<Library>,
    { filter, page, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number] | undefined> {
    const response = await getLibraryRecordsWithParticularOne(item.payload.table_name, Number(id), {
      ...options,
      filter: service.mergeCustomFilter(filter || {}, item, store),
      page
    });

    if (!response) {
      return;
    }

    const [records, totalPages, pageNumber] = response;
    const { contentTypes } = item.payload.schema;

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

  static getChildrenSortDefaultValue(): string {
    return 'created_at';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.DESC;
  }

  static async getToolbarActions(
    item: ExplorerItemData<Library>,
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

    return (
      store.explorerRole === 'dm' && (
        <>
          {currentItem.table_name === 'dl_data_kpt' && <LibraryKptRequest library={item.payload} />}
          {full && enabled && <CreateLibraryRecord library={item.payload} onCreate={createHandler} />}
          <LibraryDeletedDocumentsSwitch library={currentItem} />
          <LibraryViewSwitch to='registry' library={currentItem} path={[]} />
        </>
      )
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
