import { getPathFilter } from '../../../components/DataManagement/DataManagement.utils';
import { ExplorerSearchValue } from '../../../components/Explorer/Explorer.models';
import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { SearchRequest } from '../../../services/data/search/search.model';
import { Dataset } from '../../../services/data/vectorData/vectorData.models';
import { getAllVectorTablesInDataset } from '../../../services/data/vectorData/vectorData.service';
import { buildCql } from '../../util/cql/buildCql';

export async function getSearchRequest(search: ExplorerSearchValue): Promise<SearchRequest> {
  if (!search.searchValue?.trim()) {
    throw new Error('Отсутствует значение для поиска');
  }

  const searchRequest: SearchRequest = { text: search.searchValue };

  if (search.type) {
    searchRequest.type = search.type;
  }

  if (search.type === 'DOCUMENT') {
    const pathToFolder = search.path?.slice(2).map(item => (item.payload as LibraryRecord).id);
    const library = search.path?.find(item => item.type === 'lib')?.payload as Library;

    if (library?.table_name) {
      searchRequest.sources = [{ library: library.table_name }];
      if (pathToFolder) {
        searchRequest.ecqlFilter = buildCql(getPathFilter(pathToFolder));
      }
    }
  }

  if (search.type === 'FEATURE') {
    const dataset = search.path?.find(item => item.type === 'dataset')?.payload as Dataset;

    if (search.source) {
      searchRequest.sources = search.source;
    } else if (dataset) {
      const tables = await getAllVectorTablesInDataset(dataset);
      const sources = tables.map(table => {
        return {
          dataset: table.dataset,
          table: table.identifier
        };
      });

      searchRequest.sources = sources;
    }
  }

  return searchRequest;
}
