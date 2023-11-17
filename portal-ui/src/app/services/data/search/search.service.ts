import { SearchItemData, SearchRequest } from './search.model';
import { searchClient } from './search.client';

export async function getSearchResults(searchRequest: SearchRequest): Promise<[SearchItemData[], number]> {
  const response = await searchClient.getSearchResults(searchRequest);

  return [response.content || [], response.page.totalPages];
}
