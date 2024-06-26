import React, { ReactNode } from 'react';
import { FolderOutlined, InsertDriveFile } from '@mui/icons-material';

import { extractFeatureId } from '../../../../services/geoserver/featureType/featureType.util';
import { SortOrder } from '../../../../services/models';
import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { FeatureIcon } from '../../../FeatureIcon/FeatureIcon';
import { LibrarySearchItemActions } from '../../../LibrarySearchItemActions/LibrarySearchItemActions';
import { FeatureTitle } from '../../../SearchFeatureItemTitle/SearchFeatureItemTitle';
import { SearchResultHighlight } from '../../../SearchResultHighlight/SearchResultHighlight';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

export function assertExplorerItemDataTypeSearchItem(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.SEARCH_ITEM] {
  if (item.type !== ExplorerItemType.SEARCH_ITEM) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSearchItem {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeSearchItem(item);

    const searchItem = item.payload;
    if (searchItem.type === 'DOCUMENT') {
      return String(searchItem.payload.id) + searchItem.source.library;
    }

    if (searchItem.type === 'FEATURE') {
      return searchItem.payload.id + searchItem.source.table + searchItem.source.dataset;
    }

    throw new Error('id элемента не найдено');
  }

  static getTitle(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSearchItem(item);

    if (item.payload.type === 'DOCUMENT' && item.payload.payload.title) {
      return item.payload.payload.title;
    }

    if (item.payload.type === 'FEATURE') {
      return <FeatureTitle feature={item.payload.payload} schemaId={item.payload.source.schema} />;
    }

    return '';
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSearchItem(item);

    let createdAt: string = '';

    if (item.payload.type === 'DOCUMENT' && item.payload.payload.created_at) {
      createdAt = item.payload.payload.created_at;
    } else if (item.payload.type === 'FEATURE' && item.payload.payload.properties.created_at) {
      createdAt = item.payload.payload.properties.created_at as string;
    }

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

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSearchItem(item);

    return <LibrarySearchItemActions as='iconButton' item={item.payload} />;
  }

  static getIcon(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSearchItem(item);

    if (item.payload.type === 'DOCUMENT') {
      if (item.payload.payload.is_folder) {
        return <FolderOutlined color='primary' />;
      }

      return <InsertDriveFile color='primary' />;
    }

    if (item.payload.type === 'FEATURE') {
      return <FeatureIcon geometryType={item.payload.source.geometryType} className='' />;
    }
  }

  static additionalInfo(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSearchItem(item);

    return <SearchResultHighlight item={item.payload} />;
  }

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeSearchItem(item);

    if (item.payload.type === 'DOCUMENT') {
      const record = item.payload.payload;

      return `${record.id}. Источник данных: ${item.payload.source?.title}`;
    }

    if (item.payload.type === 'FEATURE') {
      const { payload, source } = item.payload;
      const featureDataSource = `${source?.datasetTitle} > ${source?.tableTitle}`;

      return `${String(extractFeatureId(payload.id))}. Источник данных: ${featureDataSource}`;
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
