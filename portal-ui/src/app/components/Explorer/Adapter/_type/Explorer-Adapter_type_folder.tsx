import React, { ReactNode } from 'react';
import moment from 'moment';
import { FolderOutlined } from '@mui/icons-material';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortDir } from '../../../../services/models';
import { Role } from '../../../../services/crg/permissions.models';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { convertSchema, getSchemaWithAppliedContentType } from '../../../../services/crg/schema.utils';
import { ContentTypeTypes, docLibraryService, LibraryRecord } from '../../../../services/crg/doc-library.service';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';

import { ExplorerStore } from '../../Explorer.store';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemType,
  ExplorerItemEntityType,
  SortItem,
  AllowedActions,
  AllowedDetails
} from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerUrlItem } from '../../Explorer';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: { title: string };
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
    const currentItem = await docLibraryService.getRecord(item.payload.libraryId, item.payload.id);
    const oldSchema = getSchemaWithAppliedContentType(
      await schemaService.getSchema(item.payload.schemaId),
      item.payload.content_type_id
    );
    const fields = convertSchema(oldSchema.properties);

    return (
      <>
        <ExplorerInfoDescItem multiline>
          <ExplorerInfoDescTitle>Карточка документа:</ExplorerInfoDescTitle>
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

  static async getAllowedActions(item: ExplorerItemData<LibraryRecord>): Promise<AllowedActions> {
    const currentItem = await docLibraryService.getRecord(item.payload.libraryId, item.payload.id);

    return {
      delete: {
        visible: true,
        disabled: !(currentUser.isAdmin || currentItem.role === Role.OWNER),
        itemTitle: item.payload.title,
        needConfirmation: true
      }
    };
  }

  static async getChildren(
    explorerItem: ExplorerItemData<LibraryRecord>,
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];
    const { libraryId, schemaId, id } = explorerItem.payload;

    const [libraryRecords, pagesCount] = await docLibraryService.getRecords(libraryId, schemaId, {
      page,
      pageSize,
      sort,
      sortDir,
      filter: { ...filter, parent: id }
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
    options: PageOptions,
    [, id, page]: ExplorerUrlItem
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number]> | undefined {
    const [libraryId, identifier] = id.split(':');

    const response = await docLibraryService.getRecordsWithParticularOne(
      libraryId,
      item.payload.schemaId,
      identifier,
      {
        ...options,
        page
      },
      item.payload.id
    );

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
    const payload = await docLibraryService.getDocLibrariesRecord(libraryId, identifier, item.payload.schemaId);
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
    return 'Поиск по названию';
  }

  static getToolbarActions(item: ExplorerItemData<LibraryRecord>, store: ExplorerStore): ReactNode {
    const path = item.payload.path + '/' + item.payload.id;

    return <CreateLibraryElement schemaId={item.payload.schemaId} path={path} store={store} />;
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
    await docLibraryService.deleteRecord(item.payload.libraryId, item.payload.id);
  }

  static async isDeleteAllowed(item: ExplorerItemData<LibraryRecord>): Promise<AllowedDetails> {
    const record = await docLibraryService.getRecord(item.payload.libraryId, item.payload.id);

    return {
      ok: !record.length,
      errorMessage: record.length
        ? 'Папка не является пустой. Для её удаления необходимо сперва удалить все элементы внутри.'
        : undefined
    };
  }
}
