import React from 'react';
import { HomeOutlined } from '@material-ui/icons';

import { DataSet } from '../../../../services/data.service';
import { SortDir } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';

import { ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeRoot {
  static getId(item: ExplorerItemData<DataSet>) {
    return 'root';
  }

  static getTitle(item: ExplorerItemData<DataSet>) {
    return <HomeOutlined />;
  }

  static getMeta(item: ExplorerItemData<DataSet>) {
    return '';
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
    return [
      [
        {
          type: ExplorerItemType.DATA_SET_ROOT
        },
        {
          type: ExplorerItemType.LIBRARY_ROOT
        }
      ],
      0
    ];
  }
}
