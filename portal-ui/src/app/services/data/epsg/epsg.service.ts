import { Projection } from '../../geoserver/projections.service';
import { PageOptions } from '../../models';

import { epsgClient } from './epsg.client';

export async function getKnownEpsg(pageOptions: PageOptions): Promise<[Projection[], number]> {
  const response = await epsgClient.getKnownEpsg(pageOptions);

  return [response.content || [], response.page.totalPages];
}
