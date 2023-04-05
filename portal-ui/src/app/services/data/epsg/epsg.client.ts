import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { getEpsgUrl } from '../../api/server-urls.service';
import { PageableResponse, PageOptions } from '../../models';
import { Projection } from '../../geoserver/projections.service';

export async function _reqGetKnownEpsg(pageOptions: PageOptions): Promise<PageableResponse<Projection>> {
  const params = preparePageOptions(pageOptions, true);

  return await http.get<PageableResponse<Projection>>(await getEpsgUrl(), { params });
}
