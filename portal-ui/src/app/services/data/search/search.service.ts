import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getFeaturesById } from '../../geoserver/wfs/wfs.service';
import { PageOptions } from '../../models';
import { isPageableResources } from '../../util/typeGuards/isPageableResources';
import { awaitProcess, createSearchProcess } from '../processes/processes.service';
import { getGeometryFieldName } from '../schema/schema.utils';
import { getVectorTable, getVectorTableConnections } from '../vectorData/vectorData.service';
import { SearchItemData, SearchRequest } from './search.model';

export async function getSearchResults(
  searchRequest: SearchRequest,
  pageOptions: PageOptions
): Promise<[SearchItemData[], number]> {
  const response = await createSearchProcess(searchRequest, pageOptions);
  const process = await awaitProcess(Number(response._links.process.href.split('/').at(-1)));

  if (process && isPageableResources(process.details)) {
    const details = process.details;
    const items = details.content as SearchItemData[];

    const content = await Promise.all(
      items.map(async item => {
        if (item.type === 'FEATURE') {
          const { payload, source, headlines } = item;
          const vectorTable = await getVectorTable(source.dataset, source.table);
          const wfsFeature: WfsFeature = {
            type: 'Feature',
            id: `${source.table}.${String(payload.properties.objectid)}`,
            geometry: { coordinates: [], type: source.geometryType },
            geometry_name: getGeometryFieldName(vectorTable.schema),
            properties: { ...payload.properties }
          };

          delete wfsFeature.properties.objectid;

          return { ...item, payload: wfsFeature, headlines };
        }

        return item;
      })
    );
    const newContent = await getSearchResultWithWfsFeatures(content);

    return [newContent || [], details.page.totalPages];
  }

  throw new Error('Ошибка поиска');
}

async function getSearchResultWithWfsFeatures(searchResult: SearchItemData[]): Promise<SearchItemData[]> {
  const wfsFeaturesStorage: Record<
    string,
    Record<string, { ids: string[]; features: WfsFeature[]; complexName: string }>
  > = {};

  // собираем id всех объектов, разложенные по наборам данных и таблицам
  for (const item of searchResult) {
    if (item.type !== 'FEATURE') {
      continue;
    }

    const { source, payload } = item;
    const { table, dataset } = source;
    const vectorTableConnections = await getVectorTableConnections(table);

    if (!wfsFeaturesStorage[dataset]) {
      wfsFeaturesStorage[dataset] = {};
    }

    const complexName = vectorTableConnections[0]?.layer?.complexName;

    if (!complexName) {
      continue;
    }

    if (!wfsFeaturesStorage[dataset][table]) {
      wfsFeaturesStorage[dataset][table] = {
        ids: [],
        features: [],
        complexName
      };
    }

    wfsFeaturesStorage[dataset][table].ids.push(payload.id);
  }

  // запрашиваем объекты для каждой таблицы
  for (const dataset of Object.keys(wfsFeaturesStorage)) {
    for (const table of Object.keys(wfsFeaturesStorage[dataset])) {
      const ids = wfsFeaturesStorage[dataset][table].ids;
      const complexName = wfsFeaturesStorage[dataset][table].complexName;

      if (complexName) {
        wfsFeaturesStorage[dataset][table].features = await getFeaturesById(ids, complexName);
      }
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
