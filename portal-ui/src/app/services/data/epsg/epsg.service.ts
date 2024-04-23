import { PageOptions } from '../../models';
import { epsgTitle, epsgUnit } from '../../util/epsg';
import { epsgClient } from './epsg.client';
import { EpsgModelModified } from './epsg.models';

export async function getKnownEpsg(pageOptions: PageOptions): Promise<[EpsgModelModified[], number]> {
  const response = await epsgClient.getKnownEpsg(pageOptions);

  const modifiedProjections: EpsgModelModified[] = response.content.map(proj => ({
    ...proj,
    title: `${epsgTitle(proj.srtext)}, ${proj.authName}:${proj.authSrid}, ${epsgUnit(proj.srtext)}`,
    auth_srid: proj.authSrid,
    srtext: proj.srtext,
    proj4Text: proj.proj4Text
  }));

  return [modifiedProjections || [], response.page.totalPages];
}
