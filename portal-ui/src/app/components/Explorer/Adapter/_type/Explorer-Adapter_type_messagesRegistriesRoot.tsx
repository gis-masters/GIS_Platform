import React, { type ReactNode } from 'react';
import { EmailOutlined } from '@mui/icons-material';

import {
  getMessagesRegistries,
  getMessagesRegistriesWithParticularOne,
  getMessagesRegistry
} from '../../../../services/data/messagesRegistries/messagesRegistries.service';
import { type PageOptions } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { type Adapter, type ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { type ExplorerService } from '../../Explorer.service';
import { type ExplorerStore } from '../../Explorer.store';

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
  ): Promise<[ExplorerItemData[], number]> {
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
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
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

  static async getChildById(item: ExplorerItemData, tableName: string): Promise<ExplorerItemData> {
    const messagesRegistry = await getMessagesRegistry(tableName);

    return {
      type: ExplorerItemType.MESSAGES_REGISTRY,
      payload: messagesRegistry
    };
  }
}
