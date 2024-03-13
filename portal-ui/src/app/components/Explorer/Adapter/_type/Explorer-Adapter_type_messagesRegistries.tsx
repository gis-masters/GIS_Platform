import React, { ReactNode } from 'react';
import { EmailOutlined, ViewListOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { MessagesRegistry } from '../../../../services/data/messagesRegistries/messagesRegistries.models';
import { services } from '../../../../services/services';

@staticImplements<Adapter<MessagesRegistry>>()
export class ExplorerAdapterTypeMessagesRegistry {
  static getId(item: ExplorerItemData<MessagesRegistry>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<MessagesRegistry>): string {
    return item.payload.title || '';
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
