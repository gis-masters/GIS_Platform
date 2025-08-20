import React, { ReactNode } from 'react';
import { ArticleOutlined } from '@mui/icons-material';

import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

export function assertExplorerItemDataTypeTaskHistory(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.TASK_HISTORY] {
  if (item.type !== ExplorerItemType.TASK_HISTORY) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTaskHistory {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeTaskHistory(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeTaskHistory(item);

    return formatDate(String(item.payload.massage.last_modified || item.payload.createdAt), 'HH:mm DD.MM.YYYY');
  }

  static getDetails(): string {
    return '';
  }

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeTaskHistory(item);

    return item.payload.eventType;
  }

  static getIcon(): ReactNode {
    return <ArticleOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }
}
