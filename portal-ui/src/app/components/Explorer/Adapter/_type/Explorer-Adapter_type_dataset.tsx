import React, { ReactNode } from 'react';
import { Storage } from '@mui/icons-material';

import {
  Dataset,
  VectorTable,
  getDatasetTables,
  getDatasetTablesWithParticularOne,
  getVectorTable,
  getDataset
} from '../../../../services/data/data.service';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortOrder } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService, DataChangeEvent } from '../../../../services/communication.service';
import { CreateVectorTable } from '../../../CreateVectorTable/CreateVectorTable';
import { formatDate } from '../../../../services/util/date.util';
import { Role } from '../../../../services/data/permissions.models';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { DatasetActions } from '../../../DatasetActions/DatasetActions';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { ExplorerStore } from '../../Explorer.store';
import { ExplorerService } from '../../Explorer.service';

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

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt ? (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {formatDate(createdAt, 'LL')}
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
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<VectorTable>[], number]> {
    const [tables, totalPages] = await getDatasetTables(item.payload.identifier, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), totalPages];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData<Dataset>,
    { filter, page, ...options }: PageOptions,
    identifier: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<VectorTable>[], number, number]> | undefined {
    const response = await getDatasetTablesWithParticularOne(item.payload.identifier, identifier, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store),
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

  static async getChildById(
    item: ExplorerItemData<Dataset>,
    identifier: string
  ): Promise<ExplorerItemData<VectorTable>> {
    const payload = await getVectorTable(item.payload.identifier, identifier);

    return { type: ExplorerItemType.TABLE, payload };
  }

  static getChildrenSortDefaultValue(): string {
    return 'created_at';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.DESC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }

  static async getToolbarActions(item: ExplorerItemData<Dataset>): Promise<ReactNode> {
    const currentItem = await getDataset(item.payload.identifier);
    const createEnabled = currentUser.isAdmin || [Role.OWNER, Role.CONTRIBUTOR].includes(currentItem.role);

    return createEnabled && <CreateVectorTable dataset={item.payload} />;
  }

  static getRefreshEmitters(): Emitter<DataChangeEvent<VectorTable>>[] {
    return [communicationService.vectorTableUpdated];
  }
}
