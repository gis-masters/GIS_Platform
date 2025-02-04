import React, { ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import { EmailOutlined, ViewListOutlined } from '@mui/icons-material';

import { services } from '../../../../services/services';
import { staticImplements } from '../../../../services/util/staticImplements';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

function assertExplorerItemDataTypeMessagesRegistry(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.MESSAGES_REGISTRY] {
  if (item.type !== ExplorerItemType.MESSAGES_REGISTRY) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeMessagesRegistry {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeMessagesRegistry(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeMessagesRegistry(item);

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

  static async customOpenAction(item: ExplorerItemData): Promise<void> {
    assertExplorerItemDataTypeMessagesRegistry(item);

    await services.provided;

    services.ngZone.run(() => {
      setTimeout(() => {
        void services.router.navigateByUrl(`/data-management/messages-registries/${item.payload.tableName}/registry`);
      }, 0);
    });
  }
}
