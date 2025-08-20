import React, { ReactNode } from 'react';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { Dataset } from '../../../../services/data/vectorData/vectorData.models';
import {
  getDataset,
  getDatasets,
  getDatasetsWithParticularOne
} from '../../../../services/data/vectorData/vectorData.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { CreateDataset } from '../../../CreateDataset/CreateDataset';
import { Database } from '../../../Icons/Database';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';

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
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number]> {
    const [dataSets, pagesCount] = await getDatasets({
      ...options,
      filter: filter && service.mergeCustomFilter(filter, item, store)
    });

    return [dataSets.map(payload => ({ type: ExplorerItemType.DATASET, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, page, ...options }: PageOptions,
    identifier: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const response = await getDatasetsWithParticularOne(identifier, {
      ...options,
      filter: filter && service.mergeCustomFilter(filter, item, store),
      page
    });

    if (!response) {
      return;
    }

    const [datasets, totalPages, pageNumber] = response;

    return [datasets.map(payload => ({ type: ExplorerItemType.DATASET, payload })), totalPages, pageNumber];
  }

  static async getChildById(item: ExplorerItemData, identifier: string): Promise<ExplorerItemData> {
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
    return <CreateDataset />;
  }

  static hasSearch(): boolean {
    return true;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<Dataset>>[] {
    return [communicationService.datasetUpdated];
  }
}
