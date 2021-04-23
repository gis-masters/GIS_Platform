import React from 'react';
import { HomeOutlined } from '@material-ui/icons';

import { Dataset } from '../../../../services/data.service';
import { SortDir } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeRoot {
  static getId(item: ExplorerItemData<Dataset>) {
    return 'root';
  }

  static getTitle(item: ExplorerItemData<Dataset>) {
    return <HomeOutlined />;
  }

  static getMeta(item: ExplorerItemData<Dataset>) {
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
  ): Promise<[ExplorerItemData<Dataset>[], number]> {
    return [
      [
        {
          type: ExplorerItemType.DATASET_ROOT
        },
        {
          type: ExplorerItemType.LIBRARY_ROOT
        },
        {
          type: ExplorerItemType.BASEMAPS_ROOT
        }
      ],
      0
    ];
  }
}
