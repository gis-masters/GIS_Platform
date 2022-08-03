import React, { ReactNode } from 'react';

import { Dataset, getDataset, getDatasets, getDatasetsWithParticularOne } from '../../../../services/data/data.service';
import { communicationService } from '../../../../services/communication.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { PageOptions, SortOrder } from '../../../../services/models';
import { Emitter } from '../../../../services/common/Emitter';
import { CreateDatasetElement } from '../../../CreateDatasetElement/CreateDatasetElement';
import { Database } from '../../../Icons/Database';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATASET_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDatasetRoot {
  static getId(): string {
    return 'datasetRoot';
  }

  static getTitle(): string {
    return 'Наборы данных';
  }

  static getDescription(): string {
    return 'Данные для векторных слоёв';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <Database color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions
  ): Promise<[ExplorerItemData<Dataset>[], number]> {
    const [dataSets, pagesCount] = await getDatasets({
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined
    });

    return [dataSets.map(payload => ({ type: ExplorerItemType.DATASET, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, page, ...options }: PageOptions,
    identifier: string
  ): Promise<[ExplorerItemData<Dataset>[], number, number]> | undefined {
    const response = await getDatasetsWithParticularOne(identifier, {
      ...options,
      filter: filter?.title ? { title: { $ilike: `%${String(filter.title)}%` } } : undefined,
      page
    });

    if (!response) {
      return;
    }

    const [datasets, totalPages, pageNumber] = response;

    return [datasets.map(payload => ({ type: ExplorerItemType.DATASET, payload })), totalPages, pageNumber];
  }

  static async getChildById(item: ExplorerItemData, identifier: string): Promise<ExplorerItemData<Dataset>> {
    const payload = await getDataset(identifier);

    return { type: ExplorerItemType.DATASET, payload };
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

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.DESC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }

  static getToolbarActions(): ReactNode {
    return <CreateDatasetElement />;
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.datasetsUpdated];
  }
}
