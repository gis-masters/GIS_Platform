import React, { ReactNode } from 'react';

import { Emitter } from '../../../../services/util/Emitter';
import { PageOptions, SortDir } from '../../../../services/models';
import { Basemap } from '../../../../services/crg/basemaps.models';
import { getBasemaps } from '../../../../services/crg/basemaps.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import { Basemap as BasemapIcon } from '../../../Icons/Basemap';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.BASEMAPS_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeBasemapsRoot {
  static getId(): string {
    return 'basemapsRoot';
  }

  static getTitle(): string {
    return 'Подложки';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <BasemapIcon color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { page, pageSize, sort, sortDir, filter }: PageOptions
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

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.libraryItemsUpdated];
  }
}
