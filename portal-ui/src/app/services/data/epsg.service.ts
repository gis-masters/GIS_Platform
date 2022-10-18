import { http } from '../http.service';
import { preparePageOptions } from '../http.utils';
import { getEpsgUrl } from '../server-urls.service';
import { PageableResponse, PageOptions } from '../models';
import { Projection } from '../geoserver/projections.service';

export async function getKnownEpsg(pageOptions: PageOptions): Promise<[Projection[], number]> {
  const params = preparePageOptions(pageOptions);

  const response = await http.get<PageableResponse<Projection>>(await getEpsgUrl(), { params });

  const result: Projection[] = (response._embedded && response._embedded.epsgModels).map(proj => {
    proj.identifier = `${proj.authName}:${proj.authSrid}`;

    return proj;
  });

  return [result || [], response.page.totalPages];
}
