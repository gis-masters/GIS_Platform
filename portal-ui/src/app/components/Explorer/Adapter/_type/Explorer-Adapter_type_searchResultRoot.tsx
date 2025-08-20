import React, { ReactNode } from 'react';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { LibraryRecord } from '../../../../services/data/library/library.models';
import { getSearchResults } from '../../../../services/data/search/search.service';
import { getSearchRequest } from '../../../../services/data/search/search.util';
import { PageOptions } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { ExportSearchResults } from '../../../ExportSearchResults/ExportSearchResults';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

function assertExplorerItemDataTypeSearchResultRoot(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.SEARCH_RESULT_ROOT] {
  if (item.type !== ExplorerItemType.SEARCH_RESULT_ROOT) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSearchResultRoot {
  static getId(): string {
    return 'searchResultRoot';
  }

  static getTitle(): string {
    return 'Поиск';
  }

  static getDescription(): string {
    return '';
  }

  static getMeta(): string {
    return '';
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(item: ExplorerItemData, pageOptions: PageOptions): Promise<[ExplorerItemData[], number]> {
    assertExplorerItemDataTypeSearchResultRoot(item);

    const searchRequest = await getSearchRequest(item.payload);
    const [items, pagesCount] = await getSearchResults(searchRequest, pageOptions);
    const results: ExplorerItemData[] = items.map(payload => {
      return {
        type: ExplorerItemType.SEARCH_ITEM,
        payload: payload
      };
    });

    return [results, pagesCount];
  }

  static getToolbarActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSearchResultRoot(item);

    return <ExportSearchResults item={item.payload} />;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<LibraryRecord>>[] {
    return [communicationService.libraryRecordUpdated];
  }
}
