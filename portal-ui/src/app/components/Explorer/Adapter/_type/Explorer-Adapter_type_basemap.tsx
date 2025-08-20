import React, { ReactNode } from 'react';

import { staticImplements } from '../../../../services/util/staticImplements';
import { BasemapActions } from '../../../BasemapActions/BasemapActions';
import { Basemap as BasemapIcon } from '../../../Icons/Basemap';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

export function assertExplorerItemDataTypeBasemap(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.BASEMAP] {
  if (item.type !== ExplorerItemType.BASEMAP) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeBasemap {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeBasemap(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeBasemap(item);

    return item.payload.title;
  }

  static getDetails(): string {
    return '';
  }

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeBasemap(item);

    return item.payload.name || '';
  }

  static getIcon(): ReactNode {
    return <BasemapIcon color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeBasemap(item);

    return <BasemapActions basemap={item.payload} />;
  }
}
