import React, { ReactNode } from 'react';

import { staticImplements } from '../../../../services/util/staticImplements';
import { deleteBasemap } from '../../../../services/crg/basemaps.service';
import { communicationService } from '../../../../services/communication.service';
import { Basemap } from '../../../../services/crg/basemaps.models';
import { Emitter } from '../../../../services/common/Emitter';
import { sleep } from '../../../../services/util/sleep';
import { Basemap as BasemapIcon } from '../../../Icons/Basemap';
import { BasemapDetails } from '../../../BasemapDetails/BasemapDetails';
import { ConnectionsBasemapToProjectsWidget } from '../../../ConnectionsBasemapToProjectsWidget/ConnectionsBasemapToProjectsWidget';
import { ExplorerProps } from '../../Explorer';
import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { BasemapActions } from '../../../BasemapActions/BasemapActions';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.BASEMAP]: Basemap;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeBasemap {
  static getId(item: ExplorerItemData<Basemap>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<Basemap>): string {
    return item.payload.title;
  }

  static getDetails(): string {
    return '';
  }

  static getMeta(item: ExplorerItemData<Basemap>): string {
    return item.payload.name;
  }

  static async getWidgets(
    item: ExplorerItemData<Basemap>,
    Explorer: React.ComponentType<ExplorerProps>
  ): Promise<ReactNode> {
    await sleep(0);

    return (
      <>
        <BasemapDetails basemap={item.payload} />
        <ConnectionsBasemapToProjectsWidget Explorer={Explorer} basemap={item.payload} />
      </>
    );
  }

  static getIcon(): ReactNode {
    return <BasemapIcon color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData<Basemap>): ReactNode {
    return <BasemapActions basemap={item.payload} />;
  }

  static async deleteItem(item: ExplorerItemData<Basemap>): Promise<void> {
    await deleteBasemap(item.payload.id);
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.basemapsUpdated];
  }
}
