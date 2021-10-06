import React, { ReactNode } from 'react';
import moment from 'moment';
import { LocalLibrary } from '@mui/icons-material';

import { PageOptions, SortDir } from '../../../../services/models';
import { Emitter } from '../../../../services/common/Emitter';
import { EmptyListView } from '../../../EmptyListView/EmptyListView';
import { schemaService } from '../../../../services/crg/schema.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { CreateLibraryElement } from '../../../CreateLibraryElement/CreateLibraryElement';
import {
  ContentTypeTypes,
  docLibraryService,
  DocumentLibrary,
  LibraryRecord
} from '../../../../services/crg/doc-library.service';

import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, ExplorerItemEntityType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { getDocumentLibraryRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.LIBRARY]: LibraryRecord;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeLibrary {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return `${item.type}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<LibraryRecord>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<LibraryRecord>): ReactNode {
    const { details, createdAt } = item.payload;
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
    return String(item.payload.identifier);
  }

  static async getWidgets(item: ExplorerItemData<LibraryRecord>): Promise<ReactNode> {
    const url = await getDocumentLibraryRoleAssignmentUrl(item.payload.identifier);

    return <PermissionsWidget url={url} title={item.payload.title} itemEntityType={ExplorerItemEntityType.LIBRARY} />;
  }

  static getIcon(): ReactNode {
    return <LocalLibrary color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    explorerItem: ExplorerItemData<DocumentLibrary>,
    pageOptions: PageOptions
  ): Promise<[ExplorerItemData<LibraryRecord>[], number]> {
    const result: ExplorerItemData<LibraryRecord>[] = [];

    const [libraryRecords, pagesCount] = await docLibraryService.getAllRecords(
      explorerItem.payload.identifier,
      explorerItem.payload.schemaId,
      pageOptions
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
    return 'Поиск по названию';
  }

  static getToolbarActions(item: ExplorerItemData<DocumentLibrary>, store: ExplorerStore): ReactNode {
    return <CreateLibraryElement schemaId={item.payload.schemaId} store={store} />;
  }

  static getEmptyListView(): ReactNode {
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
