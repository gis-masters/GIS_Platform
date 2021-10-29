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
          id: 'dataSetRoot',
          type: ExplorerItemType.DATASET_ROOT
        },
        {
          id: 'libraryRoot',
          type: ExplorerItemType.LIBRARY_ROOT
        },
        {
          id: 'basemapsRoot',
          type: ExplorerItemType.BASEMAPS_ROOT
        },
        {
          id: 'projectsRoot',
          type: ExplorerItemType.PROJECTS_ROOT
        }
      ],
      0
    ]);
  }

  static getChildById(item: ExplorerItemData<Dataset>, id: string): Promise<ExplorerItemData<Dataset>> {
    if (id === 'dataSetRoot') {
      return Promise.resolve({
        type: ExplorerItemType.DATASET_ROOT
      });
    }
    if (id === 'libraryRoot') {
      return Promise.resolve({
        type: ExplorerItemType.LIBRARY_ROOT
      });
    }
    if (id === 'basemapsRoot') {
      return Promise.resolve({
        type: ExplorerItemType.BASEMAPS_ROOT
      });
    }
    if (id === 'projectsRoot') {
      return Promise.resolve({
        type: ExplorerItemType.PROJECTS_ROOT
      });
    }
  }
}
