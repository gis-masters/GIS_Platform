import React, { ReactNode } from 'react';
import moment from 'moment';
import { FolderOutlined, PlaylistAddCheck } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortDir } from '../../../../services/models';
import { Role } from '../../../../services/crg/permissions.models';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { convertSchema, getSchemaWithAppliedContentType } from '../../../../services/crg/schema.utils';
import {
  ContentTypeTypes,
  deleteLibraryRecord,
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne,
  LibraryRecord
} from '../../../../services/crg/doc-library.service';
import { LibraryDocumentActions } from '../../../LibraryDocumentActions/LibraryDocumentActions.composed';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { Link } from '../../../Link/Link';

import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, ExplorerItemEntityType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerUrlItem } from '../../Explorer';
import { ExplorerService } from '../../Explorer.service';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: LibraryRecord;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFolder {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return `${item.payload.libraryId}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<LibraryRecord>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<LibraryRecord>): ReactNode {
    const { details, created_at: createdAt } = item.payload;
    moment.locale('ru');

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
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

  static async getWidgets(item: ExplorerItemData<LibraryRecord>): Promise<ReactNode> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.payload.libraryId, item.payload.id);
    const currentItem = await getLibraryRecord(item.payload.libraryId, item.payload.id, item.payload.schemaId);
    const oldSchema = getSchemaWithAppliedContentType(
      await schemaService.getSchema(item.payload.schemaId),
      item.payload.content_type_id
    );
    const fields = convertSchema(oldSchema.properties);

    return (
      <>
        <ExplorerInfoDescItem multiline>
          <ViewContentWidget fields={fields} data={item.payload} />
        </ExplorerInfoDescItem>

        <PermissionsWidget
          url={url}
          title={item.payload.title}
          itemEntityType={ExplorerItemEntityType.FOLDER}
          disabled={!(currentUser.isAdmin || currentItem.role === Role.OWNER)}
        />
      </>
    );
  }

  static isFolder(): boolean {
    return true;
  }

  static findSelectedChildren(
    children: ExplorerItemData[],
    selectedItem: ExplorerItemData<LibraryRecord>
  ): ExplorerItemData {
    return children.find(
      item => item.type === selectedItem.type && (item.payload as LibraryRecord).id === selectedItem.payload.id
    );
  }

  static getActions(item: ExplorerItemData<LibraryRecord>): ReactNode {
    return <LibraryDocumentActions document={item.payload} as='iconButton' hideOpen />;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<LibraryRecord>,
    { filter, ...options }: PageOptions
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];
    const { libraryId, schemaId, id } = explorerItem.payload;

    const [libraryRecords, pagesCount] = await getLibraryRecords(libraryId, schemaId, {
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined,
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
    { filter, ...options }: PageOptions,
    [, id, page]: ExplorerUrlItem
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number]> | undefined {
    const [libraryId, identifier] = id.split(':');

    const response = await getLibraryRecordsWithParticularOne(libraryId, item.payload.schemaId, identifier, {
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined,
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
    id: string
  ): Promise<ExplorerItemData<LibraryRecord>> {
    const [libraryId, identifier] = id.split(':');
    const payload = await getLibraryRecord(libraryId, identifier, item.payload.schemaId);
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

  static getChildrenSortDefaultDirection(): SortDir {
    return SortDir.DESC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }

  static getToolbarActions(
    item: ExplorerItemData<LibraryRecord>,
    store: ExplorerStore,
    service: ExplorerService
  ): ReactNode {
    const path = item.payload.path + '/' + item.payload.id;

    return (
      <>
        <Link href={`/data-management/library/${item.payload.libraryId}/registry`} theme='contents'>
          <Tooltip title='Открыть реестр'>
            <IconButton>
              <PlaylistAddCheck />
            </IconButton>
          </Tooltip>
        </Link>
        <CreateLibraryElement
          schemaId={item.payload.schemaId}
          path={path}
          onCreate={service.createHandler}
          store={store}
        />
      </>
    );
  }

  static getEmptyListView(): ReactNode | undefined {
    return (
      <EmptyListView
        text='Отсутствуют элементы для отображения'
        secondaryText='Начните работу с создания новых разделов или файлов'
      />
    );
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.libraryItemsUpdated];
  }

  static async deleteItem(item: ExplorerItemData<LibraryRecord>): Promise<void> {
    await deleteLibraryRecord(item.payload.libraryId, item.payload.id);
  }
}
