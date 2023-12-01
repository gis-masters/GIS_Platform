import React, { ReactNode } from 'react';

import { DataChangeEventDetail, communicationService } from '../../../../services/communication.service';
import { ExportSearchResults } from '../../../ExportSearchResults/ExportSearchResults';
import { getSearchResults } from '../../../../services/data/search/search.service';
import { LibraryRecord } from '../../../../services/data/library/library.models';
import { getSearchRequest } from '../../../../services/data/search/search.util';
import { SearchItemData } from '../../../../services/data/search/search.model';
import { staticImplements } from '../../../../services/util/staticImplements';
import { Emitter } from '../../../../services/common/Emitter';
import { PageOptions } from '../../../../services/models';

import { Adapter, ExplorerItemData, ExplorerItemType, ExplorerSearchValue } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.SEARCH_RESULT_ROOT]: ExplorerSearchValue;
  }
}

@staticImplements<Adapter<ExplorerSearchValue>>()
export class ExplorerAdapterTypeSearchResultRoot {
  static getId(): string {
    return 'searchResultRoot';
  }

  static getTitle(): string {
    return 'Результаты поиска';
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

  static async getChildren(
    item: ExplorerItemData<ExplorerSearchValue>,
    pageOptions: PageOptions
  ): Promise<[ExplorerItemData<SearchItemData>[], number]> {
    const searchRequest = await getSearchRequest(item.payload);
    const [items, pagesCount] = await getSearchResults(searchRequest, pageOptions);
    const results = items.map(payload => {
      return {
        type: ExplorerItemType.SEARCH_ITEM,
        payload: payload
      };
    });

    return [results, pagesCount];
  }

  static getToolbarActions(item: ExplorerItemData<ExplorerSearchValue>): ReactNode {
    return <ExportSearchResults item={item.payload} />;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<LibraryRecord>>[] {
    return [communicationService.libraryRecordUpdated];
  }
}
