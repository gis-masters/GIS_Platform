import React from 'react';

import { staticImplements } from '../../../../services/util/staticImplements';
import { Basemap } from '../../../../services/crg/basemaps.models';
import { Basemap as BasemapIcon } from '../../../Icons/Basemap';

import { ExplorerItemData } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.BASEMAP]: Basemap;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeBasemap {
  static getId(item: ExplorerItemData<Basemap>) {
    return `${item.type}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<Basemap>) {
    return item.payload.title;
  }

  static getDetails(item: ExplorerItemData<Basemap>) {
    return '';
  }

  static getMeta(item: ExplorerItemData<Basemap>) {
    const { name } = item.payload;

    return `${name}`;
  }

  static getIcon(item: ExplorerItemData<Basemap>) {
    return <BasemapIcon color='primary' />;
  }

  static isFolder() {
    return false;
  }
}
