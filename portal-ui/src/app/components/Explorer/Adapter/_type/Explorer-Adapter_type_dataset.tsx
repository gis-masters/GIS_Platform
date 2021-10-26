import React, { ReactNode } from 'react';
import moment from 'moment';
import { Storage } from '@mui/icons-material';

import { Dataset, DataTable, deleteDataset, getDataset, getDatasetTables } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { PageOptions, SortDir } from '../../../../services/models';
import { getDatasetRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { Emitter } from '../../../../services/common/Emitter';
import { communicationService } from '../../../../services/communication.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import {
  Adapter,
  AllowedActions,
  AllowedDetails,
  ExplorerItemData,
  ExplorerItemEntityType,
  ExplorerItemType,
  SortItem
} from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATASET]: Dataset;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDataset {
  static getId(item: ExplorerItemData<Dataset>): string {
    return `${item.type}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<Dataset>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<Dataset>): ReactNode {
    const { details, itemsCount, createdAt } = item.payload;
    moment.locale('ru');

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt ? (
          <p>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
          </p>
        ) : null}

        <p>
          <ExplorerInfoDescTitle>Таблиц:</ExplorerInfoDescTitle>
          {itemsCount}
        </p>
      </>
    );
  }

  static getMeta(item: ExplorerItemData<Dataset>): string {
    return item.payload.identifier;
  }

  static async getWidgets(item: ExplorerItemData<Dataset>): Promise<ReactNode> {
    const url = await getDatasetRoleAssignmentUrl(item.payload.identifier);
    const currentItem = await getDataset(item.payload.identifier);

    return (
      <PermissionsWidget
        url={url}
        title={item.payload.title}
        itemEntityType={ExplorerItemEntityType.DATASET}
        disabled={!(currentUser.isAdmin || currentItem.role === Role.OWNER)}
      />
    );
  }

  static getIcon(): ReactNode {
    return <Storage color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getAllowedActions(item: ExplorerItemData<Dataset>): Promise<AllowedActions> {
    const currentItem = await getDataset(item.payload.identifier);

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
    item: ExplorerItemData<Dataset>,
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<DataTable>[], number]> {
    const [tables, pagesCount] = await getDatasetTables(item.payload, { page, pageSize, sort, sortDir, filter });

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), pagesCount];
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

  static async deleteItem(item: ExplorerItemData<Dataset>): Promise<void> {
    await deleteDataset(item.payload.identifier);
  }

  static async isDeleteAllowed(item: ExplorerItemData<Dataset>): Promise<AllowedDetails> {
    const [tables] = await getDatasetTables(item.payload, { page: 0, pageSize: 1 });

    return {
      ok: !tables.length,
      errorMessage: tables.length
        ? 'Набор данных не является пустым. Для его удаления необходимо сперва удалить все таблицы внутри.'
        : undefined
    };
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.datasetsUpdated];
  }
}
