import { getBasemapsUrl, getBasemapUrl } from '../../api/server-urls.service';
import { PageableResponse, PageOptions } from '../../models';
import { preparePageOptions } from '../../api/http.utils';
import { http } from '../../api/http.service';

import { Basemap } from './basemaps.models';

export async function _reqGetBasemap(id: number): Promise<Basemap> {
  return await http.get(await getBasemapUrl(id));
}

export async function _reqGetBasemaps(pageOptions: PageOptions): Promise<PageableResponse<Basemap>> {
  const params = preparePageOptions(pageOptions);

  return await http.get<PageableResponse<Basemap>>(await getBasemapsUrl(), { params });
}

export async function _reqBetBasemapsWithParticularOne(
  id: number,
  pageOptions: PageOptions
): Promise<[Basemap[], number, number] | undefined> {
  return await http.getPageWithObject<Basemap>(
    await getBasemapsUrl(),
    preparePageOptions(pageOptions),
    (item: Basemap) => item.id === id,
    {},
    true
  );
}

export async function _reqUpdateBasemap(id: number, patch: Partial<Basemap>): Promise<void> {
  return await http.patch(await getBasemapUrl(id), patch);
}

export async function _reqDeleteBasemap(id: number): Promise<void> {
  await http.delete(await getBasemapUrl(id));
}
