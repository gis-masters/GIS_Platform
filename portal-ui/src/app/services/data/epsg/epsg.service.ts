import { Projection } from '../../geoserver/projections.service';
import { PageOptions } from '../../models';

import { _reqGetKnownEpsg } from './epsg.client';

export async function getKnownEpsg(pageOptions: PageOptions): Promise<[Projection[], number]> {
  const response = await _reqGetKnownEpsg(pageOptions);

  return [response._embedded?.epsgModels || [], response.page.totalPages];
}
