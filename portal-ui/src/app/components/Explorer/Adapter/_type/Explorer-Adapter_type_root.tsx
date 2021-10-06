import React, { ReactNode } from 'react';
import { HomeOutlined } from '@mui/icons-material';

import { Dataset } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeRoot {
  static getId(): string {
    return 'root';
  }

  static getTitle(): ReactNode {
    return <HomeOutlined />;
  }

  static getMeta(): string {
    return '';
  }

  static isFolder(): boolean {
    return true;
  }

  static getChildren(): Promise<[ExplorerItemData<Dataset>[], number]> {
    return Promise.resolve([
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
    ]);
  }
}
