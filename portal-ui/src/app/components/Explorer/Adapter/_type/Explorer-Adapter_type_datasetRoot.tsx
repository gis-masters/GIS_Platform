import React from 'react';

import { Database } from '../../../Icons/Database';
import { SortDir } from '../../../../services/models';
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
  static getId(item: ExplorerItemData<null>) {
    return 'dataSetRoot';
  }

  static getTitle(item: ExplorerItemData<Dataset>) {
    return 'Наборы данных';
  }

  static getDescription(item: ExplorerItemData<Dataset>) {
    return 'Данные для векторных слоёв';
  }

  static getMeta(item: ExplorerItemData<Dataset>) {
    return '';
  }

  static getIcon() {
    return <Database color='primary' />;
  }

  static isFolder() {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
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
