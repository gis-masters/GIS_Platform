import React, { ReactNode } from 'react';
import { LocalLibrary } from '@mui/icons-material';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { ContentTypeTypes, LibraryRecord } from '../../../../services/data/library/library.models';
import {
  getLibrary,
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne
} from '../../../../services/data/library/library.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { Role } from '../../../../services/permissions/permissions.models';
import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateLibraryRecord } from '../../../CreateLibraryRecord/CreateLibraryRecord';
import { LibraryActions } from '../../../LibraryActions/LibraryActions';
import { LibraryDeletedDocumentsSwitch } from '../../../LibraryDeletedDocumentsSwitch/LibraryDeletedDocumentsSwitch';
import { LibraryKptRequest } from '../../../LibraryKptRequest/LibraryKptRequest';
import { LibraryMassKptLoad } from '../../../LibraryMassKptLoad/LibraryMassKptLoad';
import { LibraryViewSwitch } from '../../../LibraryViewSwitch/LibraryViewSwitch';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError,
  SortItem
} from '../../Explorer.models';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

export function assertExplorerItemDataTypeLibrary(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.LIBRARY] {
  if (item.type !== ExplorerItemType.LIBRARY) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeLibrary {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeLibrary(item);

    return item.payload.table_name;
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeLibrary(item);

    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeLibrary(item);

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

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeLibrary(item);

    return String(item.payload.table_name);
  }

  static getIcon(): ReactNode {
    return <LocalLibrary color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeLibrary(item);

    return <LibraryActions library={item.payload} />;
  }

  static async getChildren(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number]> {
    assertExplorerItemDataTypeLibrary(item);

    const result: ExplorerItemData[] = [];

    const [libraryRecords, pagesCount] = await getLibraryRecords(item.payload.table_name, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    const { contentTypes } = item.payload.schema;

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

  static async getChildById(item: ExplorerItemData, recordId: string): Promise<ExplorerItemData> {
    assertExplorerItemDataTypeLibrary(item);

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
    item: ExplorerItemData,
    { filter, page, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    assertExplorerItemDataTypeLibrary(item);

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
    item: ExplorerItemData,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ): Promise<ReactNode> {
    assertExplorerItemDataTypeLibrary(item);

    const currentItem = await getLibrary(item.payload.table_name);
    const recordCreationAllowed =
      !!organizationSettings.createLibraryItem && !!currentItem.role && currentItem.role !== Role.VIEWER;

    const handleCreate = (record: LibraryRecord, isFolder: boolean) => {
      store.selectItem({ payload: record, type: isFolder ? ExplorerItemType.FOLDER : ExplorerItemType.DOCUMENT });
    };

    return (
      store.explorerRole === 'dm' && (
        <>
          {(currentItem.table_name === 'dl_data_kpt' ||
            (item.payload.schema.tags?.includes('КПТ') && item.payload.schema.tags.includes('Библиотека'))) && (
            <>
              <LibraryMassKptLoad
                disabled
                tooltipTitle='Массовая загрузка кпт из zip-архивов доступна в только в папках. Вы можете создать новую папку и перейти в нее или же выбрать из уже существующих.'
              />
              <LibraryKptRequest library={item.payload} />
            </>
          )}
          {full && recordCreationAllowed && <CreateLibraryRecord library={item.payload} onCreate={handleCreate} />}
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
