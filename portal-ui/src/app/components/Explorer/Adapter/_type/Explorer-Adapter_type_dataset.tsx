import React, { ReactNode } from 'react';
import { Storage } from '@mui/icons-material';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { VectorTable } from '../../../../services/data/vectorData/vectorData.models';
import {
  getDataset,
  getVectorTable,
  getVectorTables,
  getVectorTablesWithParticularOne
} from '../../../../services/data/vectorData/vectorData.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { Role } from '../../../../services/permissions/permissions.models';
import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { CreateVectorTable } from '../../../CreateVectorTable/CreateVectorTable';
import { DatasetActions } from '../../../DatasetActions/DatasetActions';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError,
  SortItem
} from '../../Explorer.models';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

export function assertExplorerItemDataTypeDataset(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.DATASET] {
  if (item.type !== ExplorerItemType.DATASET) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDataset {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeDataset(item);

    return item.payload.identifier;
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeDataset(item);

    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeDataset(item);

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

  static getMeta = ExplorerAdapterTypeDataset.getId;

  static getIcon(): ReactNode {
    return <Storage color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeDataset(item);

    return <DatasetActions dataset={item.payload} />;
  }

  static async getChildren(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number]> {
    assertExplorerItemDataTypeDataset(item);

    const [tables, totalPages] = await getVectorTables(item.payload.identifier, {
      ...options,
      filter: service.mergeCustomFilter(filter || {}, item, store)
    });

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), totalPages];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, page, ...options }: PageOptions,
    identifier: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    assertExplorerItemDataTypeDataset(item);

    const response = await getVectorTablesWithParticularOne(item.payload.identifier, identifier, {
      ...options,
      filter: service.mergeCustomFilter(filter || {}, item, store),
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

  static async getChildById(item: ExplorerItemData, identifier: string): Promise<ExplorerItemData> {
    assertExplorerItemDataTypeDataset(item);

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

  static async getToolbarActions(item: ExplorerItemData): Promise<ReactNode> {
    assertExplorerItemDataTypeDataset(item);

    const currentItem = await getDataset(item.payload.identifier);
    const createEnabled = currentUser.isAdmin || [Role.OWNER, Role.CONTRIBUTOR].includes(currentItem.role);

    return createEnabled && <CreateVectorTable dataset={item.payload} />;
  }

  static hasSearch(): boolean {
    return true;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<VectorTable>>[] {
    return [communicationService.vectorTableUpdated];
  }
}
