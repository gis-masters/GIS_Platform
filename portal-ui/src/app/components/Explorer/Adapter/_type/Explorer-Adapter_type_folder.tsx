import React, { ReactNode } from 'react';
import { FolderOutlined, TableViewOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { RegistryConsumer } from '@bem-react/di';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortDir } from '../../../../services/models';
import { Role } from '../../../../services/crg/permissions.models';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { applyContentType } from '../../../../services/crg/schema.utils';
import {
  ContentTypeTypes,
  deleteLibraryRecord,
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne,
  LibraryRecord
} from '../../../../services/crg/doc-library.service';
import { Link } from '../../../Link/Link';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import { formatDate } from '../../../../services/util/date.util';

import { Adapter, ExplorerItemData, ExplorerItemType, ExplorerItemEntityType, SortItem } from '../../Explorer.models';
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

  static async getWidgets(item: ExplorerItemData<LibraryRecord>): Promise<ReactNode> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.payload.libraryId, item.payload.id);
    const currentItem = await getLibraryRecord(item.payload.libraryId, item.payload.id);
    const schema = applyContentType(await schemaService.getSchema(item.payload.schemaId), item.payload.content_type_id);

    return (
      <>
        <ExplorerInfoDescItem multiline>
          <ViewContentWidget schema={schema} data={item.payload} />
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

  static getActions(item: ExplorerItemData<LibraryRecord>): ReactNode {
    return (
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }) => <LibraryDocumentActions document={item.payload} as='iconButton' hideOpen />}
      </RegistryConsumer>
    );
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

    const { contentTypes } = await schemaService.getOldSchema(schemaId);

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
    id: string
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number]> | undefined {
    const response = await getLibraryRecordsWithParticularOne(item.payload.libraryId, item.payload.schemaId, id, {
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined,
      page,
      queryParams: { parent: item.payload.id }
    });

    if (!response) {
      return;
    }

    const [records, totalPages, pageNumber] = response;

    const { contentTypes } = await schemaService.getOldSchema(item.payload.schemaId);

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
    recordId: string
  ): Promise<ExplorerItemData<LibraryRecord>> {
    const payload = await getLibraryRecord(item.payload.libraryId, Number(recordId));
    const { contentTypes } = await schemaService.getOldSchema(item.payload.schemaId);
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

  static async getToolbarActions(
    item: ExplorerItemData<LibraryRecord>,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ): Promise<ReactNode> {
    const path = `${item.payload.path}/${item.payload.id}`;
    const currentItem = await getLibraryRecord(item.payload.libraryId, item.payload.id);
    const createEnabled =
      currentUser.isAdmin ||
      (organizationSettings.createLibraryItemsEnabled && [Role.OWNER, Role.CONTRIBUTOR].includes(currentItem.role));

    return (
      full && (
        <>
          {createEnabled && (
            <CreateLibraryElement
              libraryIdentifier={item.payload.libraryId}
              schemaId={item.payload.schemaId}
              path={path}
              store={store}
            />
          )}

          <Link href={`/data-management/library/${item.payload.libraryId}/registry`} variant='contents'>
            <Tooltip title='Открыть реестр'>
              <IconButton>
                <TableViewOutlined />
              </IconButton>
            </Tooltip>
          </Link>
        </>
      )
    );
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.libraryItemsUpdated];
  }

  static async deleteItem(item: ExplorerItemData<LibraryRecord>): Promise<void> {
    await deleteLibraryRecord(item.payload.libraryId, item.payload.id);
  }
}
