import React, { ReactNode } from 'react';
import { EmailOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import {
  getMessagesRegistries,
  getMessagesRegistriesWithParticularOne,
  getMessagesRegistry
} from '../../../../services/data/messagesRegistries/messagesRegistries.service';
import { MessagesRegistry } from '../../../../services/data/messagesRegistries/messagesRegistries.models';
import { PageOptions } from '../../../../services/models';
import { ExplorerStore } from '../../Explorer.store';
import { ExplorerService } from '../../Explorer.service';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.MESSAGES_REGISTRIES_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeMessagesRegistriesRoot {
  static getId(): string {
    return 'messagesRegistries';
  }

  static getTitle(): string {
    return 'Реестры сообщений';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <EmailOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<MessagesRegistry>[], number]> {
    const [messagesRegistries, pagesCount] = await getMessagesRegistries({
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    return [messagesRegistries.map(payload => ({ type: ExplorerItemType.MESSAGES_REGISTRY, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    tableName: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<MessagesRegistry>[], number, number]> | undefined {
    const response = await getMessagesRegistriesWithParticularOne(tableName, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    if (!response) {
      return;
    }

    const [libraries, totalPages, pageNumber] = response;

    return [libraries.map(payload => ({ type: ExplorerItemType.MESSAGES_REGISTRY, payload })), totalPages, pageNumber];
  }

  static async getChildById(item: ExplorerItemData, tableName: string): Promise<ExplorerItemData<MessagesRegistry>> {
    const messagesRegistry = await getMessagesRegistry(tableName);

    return {
      type: ExplorerItemType.MESSAGES_REGISTRY,
      payload: messagesRegistry
    };
  }
}
