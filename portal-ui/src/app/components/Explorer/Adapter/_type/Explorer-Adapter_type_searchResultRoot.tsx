import { DataChangeEventDetail, communicationService } from '../../../../services/communication.service';
import { SearchItemData, SearchRequest } from '../../../../services/data/search/search.model';
import { Library, LibraryRecord } from '../../../../services/data/library/library.models';
import { getSearchResults } from '../../../../services/data/search/search.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { getPathFilter } from '../../../DataManagement/DataManagement.utils';
import { Emitter } from '../../../../services/common/Emitter';
import { cqlBuild } from '../../../../services/util/cqlBuild';
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
    const search = item.payload;
    let searchRequest: SearchRequest = { text: '' };

    if (search.type === 'DOCUMENT' && search.searchValue) {
      const pathToFolder = search.path?.slice(2).map(item => (item.payload as LibraryRecord).id);
      const library = search.path?.find(item => item.type === 'lib')?.payload as Library;
      searchRequest = {
        text: search.searchValue,
        type: 'DOCUMENT'
      };

      if (library?.table_name) {
        searchRequest.sources = [{ library: library.table_name }];
        if (pathToFolder) {
          searchRequest.ecqlFilter = cqlBuild(getPathFilter(pathToFolder));
        }
      }
    }

    if (searchRequest.text) {
      const [items] = await getSearchResults(searchRequest);
      const results = items.map(payload => {
        return {
          type: ExplorerItemType.SEARCH_ITEM,
          payload: payload
        };
      });

      const pagesCount = Math.ceil(results.length / pageOptions.pageSize);
      const pageStart =
        results.length > pageOptions.page * pageOptions.pageSize ? pageOptions.page * pageOptions.pageSize : 0;
      const pageEnd = pageStart + pageOptions.pageSize;

      return [results.slice(pageStart, pageEnd), pagesCount];
    }

    return [[], 0];
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<LibraryRecord>>[] {
    return [communicationService.libraryRecordUpdated];
  }
}
