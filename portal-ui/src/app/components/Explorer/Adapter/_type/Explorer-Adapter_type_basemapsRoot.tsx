import React, { ReactNode } from 'react';

import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions, SortDir } from '../../../../services/models';
import { Basemap } from '../../../../services/crg/basemaps.models';
import { getBasemap, getBasemaps, getBasemapsWithParticularOne } from '../../../../services/crg/basemaps.service';
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
    return 'Картографические подосновы';
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
    pageOptions: PageOptions
  ): Promise<[ExplorerItemData<Basemap>[], number]> {
    const [basemaps, totalPages] = await getBasemaps(pageOptions);
    const items: ExplorerItemData<Basemap>[] = basemaps.map(basemap => ({
      type: ExplorerItemType.BASEMAP,
      payload: basemap
    }));

    return [items, totalPages];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    pageOptions: PageOptions,
    id: string
  ): Promise<[ExplorerItemData<Basemap>[], number, number]> | undefined {
    const response = await getBasemapsWithParticularOne(Number(id), pageOptions);

    if (!response) {
      return;
    }

    const [tables, totalPages, pageNumber] = response;

    return [tables.map(payload => ({ type: ExplorerItemType.BASEMAP, payload })), totalPages, pageNumber];
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'title'
      }
    ];
  }

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData<Basemap>> {
    const basemap = await getBasemap(id);

    return {
      type: ExplorerItemType.BASEMAP,
      payload: { id: Number(id), ...basemap }
    };
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
