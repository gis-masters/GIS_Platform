import React, { ReactNode } from 'react';
import moment from 'moment';
import { IconButton, Tooltip } from '@mui/material';
import { LocalLibrary, TableViewOutlined } from '@mui/icons-material';

import { currentUser } from '../../../../stores/CurrentUser.store';
import {
  ContentTypeTypes,
  DocumentLibrary,
  getLibrary,
  getLibraryRecord,
  getLibraryRecords,
  getLibraryRecordsWithParticularOne,
  LibraryRecord
} from '../../../../services/crg/doc-library.service';
import { Link } from '../../../Link/Link';
import { Emitter } from '../../../../services/common/Emitter';
import { Role } from '../../../../services/crg/permissions.models';
import { PageOptions, SortDir } from '../../../../services/models';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { communicationService } from '../../../../services/communication.service';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import { getDocumentLibraryRoleAssignmentUrl } from '../../../../services/server-urls.service';

import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, ExplorerItemEntityType, SortItem } from '../../Explorer.models';
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
    return item.payload.identifier;
  }

  static getTitle(item: ExplorerItemData<DocumentLibrary>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<DocumentLibrary>): ReactNode {
    const { details, createdAt } = item.payload;
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

  static getMeta(item: ExplorerItemData<DocumentLibrary>): string {
    return String(item.payload.identifier);
  }

  static async getWidgets(item: ExplorerItemData<DocumentLibrary>): Promise<ReactNode> {
    const url = await getDocumentLibraryRoleAssignmentUrl(item.payload.identifier);
    const currentItem = await getLibrary(item.payload.identifier);

    return (
      <PermissionsWidget
        url={url}
        title={item.payload.title}
        itemEntityType={ExplorerItemEntityType.LIBRARY}
        disabled={!(currentUser.isAdmin || currentItem.role === Role.OWNER)}
      />
    );
  }

  static getIcon(): ReactNode {
    return <LocalLibrary color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<DocumentLibrary>,
    { filter, ...options }: PageOptions
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];

    const [libraryRecords, pagesCount] = await getLibraryRecords(
      explorerItem.payload.identifier,
      explorerItem.payload.schemaId,
      {
        ...options,
        filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined
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
    const payload = await getLibraryRecord(item.payload.identifier, Number(recordId));
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
    id: string
  ): Promise<[ExplorerItemData<LibraryRecord>[], number, number]> | undefined {
    const response = await getLibraryRecordsWithParticularOne(item.payload.identifier, item.payload.schemaId, id, {
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined,
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
    // На самом деле это не должно быть захардкожено, а должно браться из схемы.
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
    item: ExplorerItemData<DocumentLibrary>,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ): ReactNode {
    return (
      full && (
        <>
          {organizationSettings.createLibraryItemsEnabled && (
            <CreateLibraryElement
              libraryIdentifier={item.payload.identifier}
              schemaId={item.payload.schemaId}
              store={store}
            />
          )}

          <Link href={`/data-management/library/${item.payload.identifier}/registry`} theme='contents'>
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
}
