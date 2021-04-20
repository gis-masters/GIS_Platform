import React from 'react';
import moment from 'moment';
import { Storage } from '@material-ui/icons';

import { DataSet, DataTable, getDataSetTables } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { SortDir } from '../../../../services/models';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATA_SET]: DataSet;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDataSet {
  static getId(item: ExplorerItemData<DataSet>) {
    return `${item.type}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<DataSet>) {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<DataSet>) {
    const { details, itemsCount, createdAt } = item.payload;
    moment.locale('ru');

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt ? (
          <p>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
          </p>
        ) : null}

        <p>
          <ExplorerInfoDescTitle>Таблиц:</ExplorerInfoDescTitle>
          {itemsCount}
        </p>
      </>
    );
  }

  static getMeta(item: ExplorerItemData<DataSet>) {
    return item.payload.identifier;
  }

  static getIcon() {
    return <Storage color='primary' />;
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
