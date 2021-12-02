import React, { ReactNode } from 'react';
import moment from 'moment';
import { SaveOutlined, Storage } from '@mui/icons-material';

import {
  Dataset,
  dataEntitySchema,
  DataTable,
  deleteDataset,
  getDataset,
  getDatasetTables,
  getDatasetTablesWithParticularOne,
  getDataTable,
  updateDataset
} from '../../../../services/data.service';
import { getPatch } from '../../../../services/util/patch';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortDir } from '../../../../services/models';
import { Role } from '../../../../services/crg/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { staticImplements } from '../../../../services/util/staticImplements';
import { getDatasetRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { communicationService } from '../../../../services/communication.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { TextBadge } from '../../../TextBadge/TextBadge';

import {
  ActionType,
  Adapter,
  AllowedActions,
  AllowedDetails,
  ExplorerItemData,
  ExplorerItemEntityType,
  ExplorerItemType,
  SortItem
} from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerUrlItem } from '../../Explorer';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATASET]: Dataset;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDataset {
  static getId(item: ExplorerItemData<Dataset>): string {
    return item.payload.identifier;
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
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
          </ExplorerInfoDescItem>
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
      [ActionType.EDIT]: {
        visible: false, // не работает на стороне сервера
        disabled: !(currentUser.isAdmin || currentItem.role === Role.OWNER || currentItem.role === Role.CONTRIBUTOR),
        fields: dataEntitySchema,
        payload: item.payload as unknown as Record<string, Dataset[keyof Dataset]>,
        actionFunction: async (value: Dataset) => {
          await updateDataset(item.payload.identifier, getPatch(value, item.payload));
        },
        dialogTitle: (
          <>
            Редактирование набора данных
            <TextBadge id={item.payload.identifier} />
          </>
        ),
        actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' }
      },

      [ActionType.DELETE]: {
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
    const [tables, totalPages] = await getDatasetTables(item.payload.identifier, {
      page,
      pageSize,
      sort,
      sortDir,
      filter
    });

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), totalPages];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    options: PageOptions,
    [, id, page]: ExplorerUrlItem
  ): Promise<[ExplorerItemData<DataTable>[], number, number]> | undefined {
    const [datasetId, identifier] = id.split(':');

    const response = await getDatasetTablesWithParticularOne(datasetId, identifier, { ...options, page });

    if (!response) {
      return;
    }

    const [tables, totalPages, pageNumber] = response;

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), totalPages, pageNumber];
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

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData<DataTable>> {
    const [datasetId, identifier] = id.split(':');
    const payload = await getDataTable(datasetId, identifier);

    return { type: ExplorerItemType.TABLE, payload };
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

  static async deleteItem(item: ExplorerItemData<Dataset>): Promise<void> {
    await deleteDataset(item.payload.identifier);
  }

  static async isDeleteAllowed(item: ExplorerItemData<Dataset>): Promise<AllowedDetails> {
    const [tables] = await getDatasetTables(item.payload.identifier, { page: 0, pageSize: 1 });

    return {
      ok: !tables.length,
      errorMessage: tables.length
        ? 'Набор данных не является пустым. Для его удаления необходимо сперва удалить все таблицы внутри.'
        : undefined
    };
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.dataTablesUpdated];
  }
}
