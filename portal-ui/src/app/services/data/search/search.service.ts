import { getFeaturesById } from '../../geoserver/wfs/wfs.service';
import { currentUser } from '../../../stores/CurrentUser.store';
import { SearchItemData, SearchRequest } from './search.model';
import { getGeometryFieldName } from '../schema/schema.utils';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { schemaService } from '../schema/schema.service';
import { searchClient } from './search.client';
import { PageOptions } from '../../models';

export async function getSearchResults(
  searchRequest: SearchRequest,
  pageOptions: PageOptions
): Promise<[SearchItemData[], number]> {
  const response = await searchClient.getSearchResults(searchRequest, pageOptions);
  const content = await Promise.all(
    response.content.map(async item => {
      if (item.type === 'FEATURE') {
        const { payload, source, headlines } = item;
        const schema = await schemaService.getSchema(source.schema);
        const wfsFeature: WfsFeature = {
          type: 'Feature',
          id: `${source.table}.${String(payload.properties.objectid)}`,
          geometry: { coordinates: [], type: source.geometryType },
          geometry_name: getGeometryFieldName(schema),
          properties: { ...payload.properties }
        };

        delete wfsFeature.properties.objectid;

        return { ...item, payload: wfsFeature, headlines };
      }

      return item;
    })
  );

  const newContent = await getSearchResultWithWfsFeatures(content);

  return [newContent || [], response.page.totalPages];
}

async function getSearchResultWithWfsFeatures(searchResult: SearchItemData[]): Promise<SearchItemData[]> {
  const wfsFeaturesStorage: Record<string, Record<string, { ids: string[]; features: WfsFeature[] }>> = {};

  // собираем id всех объектов, разложенные по наборам данных и таблицам
  for (const item of searchResult) {
    if (item.type !== 'FEATURE') {
      continue;
    }

    const { source, payload } = item;
    const { table, dataset } = source;

    if (!wfsFeaturesStorage[dataset]) {
      wfsFeaturesStorage[dataset] = {};
    }
    if (!wfsFeaturesStorage[dataset][table]) {
      wfsFeaturesStorage[dataset][table] = { ids: [], features: [] };
    }

    wfsFeaturesStorage[dataset][table].ids.push(payload.id);
  }

  // запрашиваем объекты для каждой таблицы
  for (const dataset of Object.keys(wfsFeaturesStorage)) {
    for (const table of Object.keys(wfsFeaturesStorage[dataset])) {
      const ids = wfsFeaturesStorage[dataset][table].ids;
      wfsFeaturesStorage[dataset][table].features = await getFeaturesById(ids, `${currentUser.workspaceName}:${table}`);
    }
  }

  // добавляем объекты в результат
  return searchResult.map(item => {
    if (item.type !== 'FEATURE') {
      return item;
    }

    const { source, payload } = item;
    const { table, dataset } = source;
    const features = wfsFeaturesStorage[dataset][table].features;
    const feature = features.find(f => f.id === payload.id);

    return feature ? { ...item, payload: feature } : item;
  });
}
