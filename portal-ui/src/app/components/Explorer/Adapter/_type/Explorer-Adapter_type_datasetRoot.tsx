import React, { ReactNode } from 'react';

import { Database } from '../../../Icons/Database';
import { PageOptions, SortDir } from '../../../../services/models';
import { Dataset, getDatasets } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';

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

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'title'
      },
      {
        label: 'Дате создания',
        value: 'createdAt'
      },
      {
        label: 'Количеству таблиц',
        value: 'itemsCount'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'createdAt';
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
}
