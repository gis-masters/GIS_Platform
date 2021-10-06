import React, { ReactNode } from 'react';
import moment from 'moment';
import { FolderOutlined } from '@mui/icons-material';

import { PageOptions, SortDir } from '../../../../services/models';
import { Emitter } from '../../../../services/common/Emitter';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import { ContentTypeTypes, docLibraryService, LibraryRecord } from '../../../../services/crg/doc-library.service';

import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, ExplorerItemEntityType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFolder {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return `${item.type}:${item.payload.id}`;
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
          <p>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
          </p>
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

    return <PermissionsWidget url={url} title={item.payload.title} itemEntityType={ExplorerItemEntityType.FOLDER} />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<LibraryRecord>,
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];

    const [libraryRecords, pagesCount] = await docLibraryService.getAllRecords(
      explorerItem.payload.libraryId,
      explorerItem.payload.schemaId,
      { page, pageSize, sort, sortDir, filter: { ...filter, parent: explorerItem.payload.id } }
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
}
