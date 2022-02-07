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

const children = [
  {
    id: 'datasetRoot',
    type: ExplorerItemType.DATASET_ROOT,
    payload: null
  },
  {
    id: 'libraryRoot',
    type: ExplorerItemType.LIBRARY_ROOT,
    payload: null
  },
  {
    id: 'basemapsRoot',
    type: ExplorerItemType.BASEMAPS_ROOT,
    payload: null
  },
  {
    id: 'projectsRoot',
    type: ExplorerItemType.PROJECTS_ROOT,
    payload: null
  }
];

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
    return Promise.resolve([children, 1]);
  }

  // eslint-disable-next-line sonarjs/no-identical-functions
  static getChildrenWithParticularOne(): Promise<[ExplorerItemData<Dataset>[], number, number]> {
    return Promise.resolve([children, 1, 0]);
  }

  static getChildById(item: ExplorerItemData<Dataset>, id: string): Promise<ExplorerItemData<Dataset>> {
    if (id === 'datasetRoot') {
      return Promise.resolve({
        id: 'datasetRoot',
        type: ExplorerItemType.DATASET_ROOT,
        payload: null
      });
    }
    if (id === 'libraryRoot') {
      return Promise.resolve({
        id: 'libraryRoot',
        type: ExplorerItemType.LIBRARY_ROOT,
        payload: null
      });
    }
    if (id === 'basemapsRoot') {
      return Promise.resolve({
        id: 'basemapsRoot',
        type: ExplorerItemType.BASEMAPS_ROOT,
        payload: null
      });
    }
    if (id === 'projectsRoot') {
      return Promise.resolve({
        id: 'projectsRoot',
        type: ExplorerItemType.PROJECTS_ROOT,
        payload: null
      });
    }
  }
}
