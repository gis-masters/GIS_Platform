import React from 'react';

import { Database } from '../../../Icons/Database';
import { SortDir } from '../../../../services/models';
import { DataSet, getDataSets } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';

import { ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATA_SET_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDataSetRoot {
  static getId(item: ExplorerItemData<null>) {
    return 'dataSetRoot';
  }

  static getTitle(item: ExplorerItemData<DataSet>) {
    return 'Наборы данных';
  }

  static getDescription(item: ExplorerItemData<DataSet>) {
    return 'Данные для векторных слоёв';
  }

  static getMeta(item: ExplorerItemData<DataSet>) {
    return '';
  }

  static getIcon() {
    return <Database htmlColor='#16237f' />;
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
  ): Promise<[ExplorerItemData<DataSet>[], number]> {
    const [dataSets, pagesCount] = await getDataSets(page, pageSize, sort, sortDir, filter);

    return [dataSets.map(payload => ({ type: ExplorerItemType.DATA_SET, payload })), pagesCount];
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
