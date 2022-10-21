import { http } from '../http.service';
import { preparePageOptions } from '../http.utils';
import { getEpsgUrl } from '../server-urls.service';
import { PageableResponse, PageOptions } from '../models';
import { Projection } from '../geoserver/projections.service';

export async function getKnownEpsg(pageOptions: PageOptions): Promise<[Projection[], number]> {
  const params = preparePageOptions(pageOptions, true);

  const response = await http.get<PageableResponse<Projection>>(await getEpsgUrl(), { params });

  return [response._embedded?.epsgModels || [], response.page.totalPages];
}
