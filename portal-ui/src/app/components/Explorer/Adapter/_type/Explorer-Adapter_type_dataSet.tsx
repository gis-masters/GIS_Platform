import React from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';
import { FeaturedPlayList } from '@material-ui/icons';

import { DataSet, DataTable, getDataSetTables } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { SortDir } from '../../../../services/models';

import { ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATA_SET]: DataSet;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDataSet {
  static getId(item: ExplorerItemData<DataSet>) {
    return `${item.type}:${item.payload.resourceIdentifier}`;
  }

  static getTitle(item: ExplorerItemData<DataSet>) {
    return item.payload.title;
  }

  static getDetails(item: ExplorerItemData<DataSet>) {
    return item.payload.details;
  }

  static getMeta(item: ExplorerItemData<DataSet>) {
    const { itemsCount, createdAt, resourceIdentifier } = item.payload;
    moment.locale('ru');
    const date = createdAt ? `, ${moment(createdAt).format('LL')}` : '';

    return `${itemsCount} ${pluralize(itemsCount, 'таблица', 'таблицы', 'таблиц')}${date} (${resourceIdentifier})`;
  }

  static getIcon() {
    return <FeaturedPlayList />;
  }

  static isFolder() {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData<DataSet>,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[ExplorerItemData<DataTable>[], number]> {
    const [tables, pagesCount] = await getDataSetTables(item.payload, page, pageSize, sort, sortDir, filter);

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), pagesCount];
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
