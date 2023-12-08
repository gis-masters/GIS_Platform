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
        const { payload, source } = item;
        const schema = await schemaService.getSchema(source.schema);
        const wfsFeature: WfsFeature = {
          type: 'Feature',
          id: `${source.table}.${String(payload.objectid)}`,
          geometry_name: getGeometryFieldName(schema),
          properties: { ...payload }
        };

        delete wfsFeature.properties.objectid;

        return { ...item, payload: wfsFeature };
      }

      return item;
    })
  );

  return [content || [], response.page.totalPages];
}
