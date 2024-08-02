import React, { ReactNode } from 'react';
import { FolderOutlined } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { ContentTypeTypes, Library, LibraryRecord } from '../../../../services/data/library/library.models';
import {
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne,
  getLibrarySchemaByRecord
} from '../../../../services/data/library/library.service';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { PageOptions, SortOrder } from '../../../../services/models';
import { Role } from '../../../../services/permissions/permissions.models';
import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateLibraryRecord } from '../../../CreateLibraryRecord/CreateLibraryRecord';
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

function assertExplorerItemDataTypeFolder(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.FOLDER] {
  if (item.type !== ExplorerItemType.FOLDER) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFolder {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeFolder(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeFolder(item);

    return item.payload.title || '';
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeFolder(item);

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

  static getMeta = ExplorerAdapterTypeFolder.getId;

  static getIcon(): ReactNode {
    return <FolderOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeFolder(item);

    return (
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }: CommonDiRegistry) => (
          <LibraryDocumentActions document={item.payload} as='iconButton' hideOpen />
        )}
      </RegistryConsumer>
    );
  }

  static async getChildren(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number]> {
    assertExplorerItemDataTypeFolder(item);

    const result: ExplorerItemData[] = [];
    const { libraryTableName, id } = item.payload;

    const [libraryRecords, pagesCount] = await getLibraryRecords(libraryTableName, {
      ...options,
      filter: service.mergeCustomFilter(filter || {}, item, store),
      queryParams: { parent: id }
    });

    const { contentTypes } = await getLibrarySchemaByRecord(item.payload);

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
    item: ExplorerItemData,
    { filter, page, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    assertExplorerItemDataTypeFolder(item);

    const response = await getLibraryRecordsWithParticularOne(item.payload.libraryTableName, Number(id), {
      ...options,
      filter: service.mergeCustomFilter(filter || {}, item, store),
      page,
      queryParams: { parent: item.payload.id }
    });

    if (!response) {
      return;
    }

    const [records, totalPages, pageNumber] = response;

    const { contentTypes } = await getLibrarySchemaByRecord(item.payload);

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

  static async getChildById(item: ExplorerItemData, recordId: string): Promise<ExplorerItemData> {
    assertExplorerItemDataTypeFolder(item);

    const payload = await getLibraryRecord(item.payload.libraryTableName, Number(recordId));
    const { contentTypes } = await getLibrarySchemaByRecord(item.payload);
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

  static async getToolbarActions(item: ExplorerItemData, store: ExplorerStore): Promise<ReactNode> {
    assertExplorerItemDataTypeFolder(item);

    const currentItem = await getLibraryRecord(item.payload.libraryTableName, item.payload.id);
    const createEnabled =
      !!organizationSettings.createLibraryItem &&
      !!currentItem.role &&
      [Role.OWNER, Role.CONTRIBUTOR].includes(currentItem.role);
    const handleCreate = (record: LibraryRecord, isFolder: boolean) => {
      store.selectItem({ payload: record, type: isFolder ? ExplorerItemType.FOLDER : ExplorerItemType.DOCUMENT });
    };
    const library = store.path.find(({ type }) => type === ExplorerItemType.LIBRARY)?.payload as Library;
    const path = store?.path
      .filter(({ type }) => type === ExplorerItemType.FOLDER)
      .map(({ payload }) => (payload as LibraryRecord).id);

    return (
      <>
        {(currentItem.libraryTableName === 'dl_data_kpt' ||
          (library.schema.tags?.includes('КПТ') && library.schema.tags.includes('Библиотека'))) && (
          <>
            <LibraryMassKptLoad
              libraryRecord={item.payload}
              parent={currentItem}
              library={library}
              role={currentItem.role}
            />
            <LibraryKptRequest library={library} />
          </>
        )}
        {createEnabled && <CreateLibraryRecord library={library} parent={currentItem} onCreate={handleCreate} />}
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
