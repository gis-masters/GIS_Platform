import React, { ReactNode } from 'react';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { Basemap } from '../../../../services/data/basemaps/basemaps.models';
import {
  getBasemap,
  getBasemaps,
  getBasemapsWithParticularOne
} from '../../../../services/data/basemaps/basemaps.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { Basemap as BasemapIcon } from '../../../Icons/Basemap';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';

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

  static async getChildren(item: ExplorerItemData, pageOptions: PageOptions): Promise<[ExplorerItemData[], number]> {
    const [basemaps, totalPages] = await getBasemaps(pageOptions);
    const items: ExplorerItemData[] = basemaps.map(basemap => ({
      type: ExplorerItemType.BASEMAP,
      payload: basemap
    }));

    return [items, totalPages];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const response = await getBasemapsWithParticularOne(Number(id), {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

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

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData> {
    const basemap = await getBasemap(Number(id));

    return {
      type: ExplorerItemType.BASEMAP,
      payload: basemap
    };
  }

  static getChildrenSortDefaultValue(): string {
    return 'title';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.DESC;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<Basemap>>[] {
    return [communicationService.basemapUpdated];
  }
}
