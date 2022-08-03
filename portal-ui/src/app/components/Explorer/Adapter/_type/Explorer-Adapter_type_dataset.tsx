import React, { ReactNode } from 'react';
import { Storage } from '@mui/icons-material';

import {
  Dataset,
  VectorTable,
  getDatasetTables,
  getDatasetTablesWithParticularOne,
  getVectorTable
} from '../../../../services/data/data.service';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortOrder } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { formatDate } from '../../../../services/util/date.util';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { DatasetActionsAddToProject } from '../../../DatasetActions/AddToProject/DatasetActions-AddToProject';
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
    { filter, ...options }: PageOptions
  ): Promise<[ExplorerItemData<VectorTable>[], number]> {
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
  ): Promise<[ExplorerItemData<VectorTable>[], number, number]> | undefined {
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

  static getToolbarActions(item: ExplorerItemData<Dataset>): ReactNode {
    return <DatasetActionsAddToProject dataset={item.payload} />;
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.vectorTablesUpdated];
  }
}
