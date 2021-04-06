import React from 'react';

import { SortDir } from '../../../../services/models';
import { Emitter } from '../../../../services/util/Emitter';
import { Basemap } from '../../../../services/crg/basemaps.models';
import { getBasemaps } from '../../../../services/crg/basemaps.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { Basemap as BasemapIcon } from '../../../Icons/Basemap';

import { Adapter } from '../Explorer-Adapter';
import { ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.BASEMAPS_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeBasemapsRoot {
  static getId(item: ExplorerItemData<null>) {
    return 'basemapsRoot';
  }

  static getTitle(item: ExplorerItemData<Basemap>) {
    return 'Подложки';
  }

  static getMeta(item: ExplorerItemData<Basemap>) {
    return '';
  }

  static getIcon() {
    return <BasemapIcon color='primary' />;
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
  ): Promise<[ExplorerItemData<Basemap>[], number]> {
    const [basemaps, totalPages] = await getBasemaps(page, pageSize, sort, sortDir, filter);
    const items: ExplorerItemData<Basemap>[] = basemaps.map(basemap => ({
      type: ExplorerItemType.BASEMAP,
      payload: basemap
    }));

    return [items, totalPages];
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'title'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'title';
  }

  static getChildrenSortDefaultDirection(): SortDir {
    return SortDir.DESC;
  }

  static getRefreshEmitters(item: ExplorerItemData): Emitter[] {
    return [communicationService.libraryItemsUpdated];
  }
}
