import React from 'react';
import { pluralize } from 'numeralize-ru';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { staticImplements } from '../../../../services/util/staticImplements';
import { deleteBasemap, getBasemapConnections } from '../../../../services/crg/basemaps.service';
import { communicationService } from '../../../../services/communication.service';
import { Basemap } from '../../../../services/crg/basemaps.models';
import { Emitter } from '../../../../services/util/Emitter';
import { Basemap as BasemapIcon } from '../../../Icons/Basemap';

import { Adapter, AllowedActions, ExplorerItemData } from '../../Explorer.models';

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

  static async getAllowedActions(item: ExplorerItemData<Basemap>): Promise<AllowedActions> {
    const deletionAllowed = currentUser.isAdmin;
    const count = (await getBasemapConnections(item.payload.id)).length;
    const textProjects = pluralize(count, 'проекте', 'проектах', 'проектах');

    return {
      delete: {
        visible: true,
        disabled: !deletionAllowed,
        needConfirmation: true,
        confirmationText: count ? `Используется в ${count} ${textProjects}.` : 'Не используется в проектах.'
      }
    };
  }

  static async deleteItem(item: ExplorerItemData<Basemap>) {
    await deleteBasemap(item.payload.id);
  }

  static getRefreshEmitters(item: ExplorerItemData): Emitter[] {
    return [communicationService.basemapsUpdated];
  }
}
