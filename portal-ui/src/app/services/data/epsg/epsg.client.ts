import { http } from '../../http.service';
import { preparePageOptions } from '../../http.utils';
import { getEpsgUrl } from '../../server-urls.service';
import { PageableResponse, PageOptions } from '../../models';
import { Projection } from '../../geoserver/projections.service';

export async function _reqGetKnownEpsg(pageOptions: PageOptions): Promise<PageableResponse<Projection>> {
  const params = preparePageOptions(pageOptions, true);

  return await http.get<PageableResponse<Projection>>(await getEpsgUrl(), { params });
}
