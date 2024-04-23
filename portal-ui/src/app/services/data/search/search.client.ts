import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { PageOptions } from '../../models';
import { SearchRawItemData, SearchRequest } from './search.model';

@boundClass
class SearchClient extends Client {
  private static _instance: SearchClient;

  static get instance(): SearchClient {
    return this._instance || (this._instance = new this());
  }

  private getSearchResultUrl(page: number, size: number): string {
    return `${this.getDataUrl()}/fts?page=${page}&size=${size}`;
  }

  async getSearchResults(
    searchRequest: SearchRequest,
    pageOptions: PageOptions
  ): Promise<PageableResources<SearchRawItemData>> {
    return await http.post<PageableResources<SearchRawItemData>>(
      this.getSearchResultUrl(pageOptions.page, pageOptions.pageSize),
      searchRequest,
      {
        cache: { disabled: false, clear: false }
      }
    );
  }
}

export const searchClient = SearchClient.instance;
