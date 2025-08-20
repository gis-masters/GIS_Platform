import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { PageOptions } from '../../models';
import { isPageableResources } from '../../util/typeGuards/isPageableResources';
import { awaitProcess, createSearchProcess } from '../processes/processes.service';
import { getGeometryFieldName } from '../schema/schema.utils';
import { getVectorTable } from '../vectorData/vectorData.service';
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

    return [content || [], details.page.totalPages];
  }

  throw new Error('Ошибка поиска');
}
