import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { http } from '../../api/http.service';
import { Client } from '../../api/Client';

import { SearchItemData, SearchRequest } from './search.model';

@boundClass
class SearchClient extends Client {
  private static _instance: SearchClient;

  static get instance(): SearchClient {
    return this._instance || (this._instance = new this());
  }

  private getSearchResultUrl(): string {
    return `${this.getDataUrl()}/fts`;
  }

  async getSearchResults(searchRequest: SearchRequest): Promise<PageableResources<SearchItemData>> {
    return await http.post<PageableResources<SearchItemData>>(this.getSearchResultUrl(), searchRequest);
  }
}

export const searchClient = SearchClient.instance;
