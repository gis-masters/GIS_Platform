import React, { ReactNode } from 'react';

import { PageOptions, SortDir } from '../../../../services/models';
import { Dataset, getDataset, getDatasets, getDatasetsWithParticularOne } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { Database } from '../../../Icons/Database';
import { CreateDatasetElement } from '../../../CreateDatasetElement/CreateDatasetElement';

import { ExplorerUrlItem } from '../../Explorer';
import { ExplorerStore } from '../../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATASET_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDatasetRoot {
  static getId(): string {
    return 'dataSetRoot';
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
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<Dataset>[], number]> {
    const [dataSets, pagesCount] = await getDatasets(page, pageSize, sort, sortDir, filter);

    return [dataSets.map(payload => ({ type: ExplorerItemType.DATASET, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    options: PageOptions,
    [, identifier, page]: ExplorerUrlItem
  ): Promise<[ExplorerItemData<Dataset>[], number, number]> | undefined {
    const response = await getDatasetsWithParticularOne(identifier, { ...options, page });

    if (!response) {
      return;
    }

    const [datasets, totalPages, pageNumber] = response;

    return [datasets.map(payload => ({ type: ExplorerItemType.DATASET, payload })), totalPages, pageNumber];
  }

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData<Dataset>> {
    const payload = await getDataset(id);

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

  static getChildrenSortDefaultDirection(): SortDir {
    return SortDir.DESC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Поиск по названию';
  }

  static getToolbarActions(item: ExplorerItemData<Dataset>, store: ExplorerStore): ReactNode {
    return <CreateDatasetElement store={store} />;
  }
}
