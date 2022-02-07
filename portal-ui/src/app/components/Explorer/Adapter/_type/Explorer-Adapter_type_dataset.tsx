import React, { ReactNode } from 'react';
import moment from 'moment';
import { Storage } from '@mui/icons-material';

import {
  Dataset,
  DataTable,
  getDataset,
  getDatasetTables,
  getDatasetTablesWithParticularOne,
  getDataTable
} from '../../../../services/data.service';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortDir } from '../../../../services/models';
import { Role } from '../../../../services/crg/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { staticImplements } from '../../../../services/util/staticImplements';
import { getDatasetRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { communicationService } from '../../../../services/communication.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import { Adapter, ExplorerItemData, ExplorerItemEntityType, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { DatasetActions } from '../../../DatasetActions/DatasetActions';

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

  static getActions(item: ExplorerItemData<Dataset>): ReactNode {
    return <DatasetActions dataset={item.payload} />;
  }

  static async getChildren(
    item: ExplorerItemData<Dataset>,
    { filter, ...options }: PageOptions
  ): Promise<[ExplorerItemData<DataTable>[], number]> {
    const [tables, totalPages] = await getDatasetTables(item.payload.identifier, {
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined
    });

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), totalPages];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData<Dataset>,
    { filter, page, ...options }: PageOptions,
    identifier: string
  ): Promise<[ExplorerItemData<DataTable>[], number, number]> | undefined {
    const response = await getDatasetTablesWithParticularOne(item.payload.identifier, identifier, {
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined,
      page
    });

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

  static async getChildById(item: ExplorerItemData<Dataset>, identifier: string): Promise<ExplorerItemData<DataTable>> {
    const payload = await getDataTable(item.payload.identifier, identifier);

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

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.dataTablesUpdated];
  }
}
