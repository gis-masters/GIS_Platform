import React, { ReactNode } from 'react';
import { EmailOutlined, ViewListOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { MessagesRegistry } from '../../../../services/data/messagesRegistries.service';
import { services } from '../../../../services/services';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.MESSAGES_REGISTRY]: MessagesRegistry;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeMessagesRegistry {
  static getId(item: ExplorerItemData<MessagesRegistry>): string {
    return item.payload.tableName;
  }

  static getTitle(item: ExplorerItemData<MessagesRegistry>): string {
    return item.payload.title;
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

  static customOpenActionIcon(): ReactNode {
    return (
      <Tooltip title='Перейти в реестр'>
        <ViewListOutlined />
      </Tooltip>
    );
  }

  static async customOpenAction(item: ExplorerItemData<MessagesRegistry>): Promise<void> {
    await services.provided;

    services.ngZone.run(() => {
      setTimeout(() => {
        void services.router.navigateByUrl(`/data-management/messages-registries/${item.payload.tableName}/registry`);
      }, 0);
    });
  }
}
