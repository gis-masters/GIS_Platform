import React, { ReactNode } from 'react';
import { FolderOutlined } from '@mui/icons-material';

import { LibrarySearchItemActions } from '../../../LibrarySearchItemActions/LibrarySearchItemActions';
import { SearchResultHighlight } from '../../../SearchResultHighlight/SearchResultHighlight';
import { FeatureTitle } from '../../../SearchFeatureItemTitle/SearchFeatureItemTitle';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { SearchItemData } from '../../../../services/data/search/search.model';
import { extractFeatureId } from '../../../../services/geoserver/feature.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { formatDate } from '../../../../services/util/date.util';
import { FeatureIcon } from '../../../FeatureIcon/FeatureIcon';
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
    const searchItem = item.payload;
    if (searchItem.type === 'DOCUMENT') {
      return String(searchItem.payload.id) + searchItem.source.library;
    }

    if (searchItem.type === 'FEATURE') {
      return searchItem.payload.id + searchItem.source.table + searchItem.source.dataset;
    }

    throw new Error('id элемента не найдено');
  }

  static getTitle(item: ExplorerItemData<SearchItemData>): ReactNode {
    if (item.payload.type === 'DOCUMENT' && item.payload.payload.title) {
      return item.payload.payload.title;
    }

    if (item.payload.type === 'FEATURE') {
      return <FeatureTitle feature={item.payload.payload} schemaId={item.payload.source.schema} />;
    }

    return '';
  }

  static getDescription(item: ExplorerItemData<SearchItemData>): ReactNode {
    let createdAt: string;

    if (item.payload.type === 'DOCUMENT' && item.payload.payload.created_at) {
      createdAt = item.payload.payload.created_at;
    }

    if (item.payload.type === 'FEATURE' && item.payload.payload.properties.created_at) {
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

    if (item.payload.type === 'FEATURE') {
      return <FeatureIcon geometryType={item.payload.source.geometryType} className='' />;
    }
  }

  static additionalInfo(item: ExplorerItemData<SearchItemData>): ReactNode {
    return <SearchResultHighlight item={item.payload} />;
  }

  static getMeta(item: ExplorerItemData<SearchItemData>): string {
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
