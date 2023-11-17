import React, { ReactNode } from 'react';
import { FolderOutlined } from '@mui/icons-material';

import { LibrarySearchItemActions } from '../../../LibrarySearchItemActions/LibrarySearchItemActions';
import { SearchItemData } from '../../../../services/data/search/search.model';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { staticImplements } from '../../../../services/util/staticImplements';
import { formatDate } from '../../../../services/util/date.util';
import { SortOrder } from '../../../../services/models';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { getIcon } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.SEARCH_ITEM]: SearchItemData;
  }
}

@staticImplements<Adapter<SearchItemData>>()
export class ExplorerAdapterTypeSearchItem {
  static getId(item: ExplorerItemData<SearchItemData>): string {
    if (item.payload.type === 'DOCUMENT') {
      return String(item.payload.payload.id);
    }

    throw new Error('id элемента не найдено');
  }

  static getTitle(item: ExplorerItemData<SearchItemData>): string {
    if (item.payload.type === 'DOCUMENT' && item.payload.payload.title) {
      return item.payload.payload.title;
    }

    return '';
  }

  static getDescription(item: ExplorerItemData<SearchItemData>): ReactNode {
    if (item.payload.type === 'DOCUMENT') {
      const { created_at: createdAt } = item.payload.payload;

      return (
        <>
          {createdAt && (
            <ExplorerInfoDescItem>
              <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
              {formatDate(createdAt, 'LL')}
            </ExplorerInfoDescItem>
          )}
        </>
      );
    }
  }

  static getActions(item: ExplorerItemData<SearchItemData>): ReactNode {
    return <LibrarySearchItemActions as='iconButton' item={item.payload} />;
  }

  static getIcon(item: ExplorerItemData<SearchItemData>): ReactNode {
    if (item.payload.type === 'DOCUMENT') {
      if (item.payload.payload.is_folder) {
        return <FolderOutlined color='primary' />;
      }

      return getIcon({ type: ExplorerItemType.DOCUMENT, payload: {} });
    }
  }

  static getMeta(item: ExplorerItemData<SearchItemData>): string {
    if (item.payload.type === 'DOCUMENT') {
      const record = item.payload.payload;

      return `${record.id}. Источник данных: ${String(item.payload.source?.library)}`;
    }

    return '';
  }

  static isFolder(): boolean {
    return false;
  }

  static getChildrenSortDefaultValue(): string {
    return 'name';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.ASC;
  }
}
