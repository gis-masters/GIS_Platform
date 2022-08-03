import { getBasemapsUrl, getBasemapUrl } from '../server-urls.service';
import { communicationService } from '../communication.service';
import { PageableResponse, PageOptions } from '../models';
import { preparePageOptions } from '../http.utils';
import { Basemap } from './basemaps.models';
import { http } from '../http.service';

export async function getBasemaps(pageOptions: PageOptions): Promise<[Basemap[], number]> {
  const params = preparePageOptions(pageOptions);
  const response = await http.get<PageableResponse<Basemap>>(await getBasemapsUrl(), { params });

  return [(response._embedded && response._embedded.basemaps) || [], response.page.totalPages];
}

export async function getBasemapsWithParticularOne(
  id: number,
  pageOptions: PageOptions
): Promise<[Basemap[], number, number] | undefined> {
  return await http.getPageWithObject<Basemap>(
    await getBasemapsUrl(),
    preparePageOptions(pageOptions),
    (item: Basemap) => item.id === id
  );
}

export async function getBasemap(basemapId: string): Promise<Basemap> {
  return await http.get(await getBasemapUrl(Number(basemapId)));
}

export async function deleteBasemap(basemapId: number): Promise<void> {
  await http.delete(await getBasemapUrl(basemapId));
  communicationService.basemapsUpdated.emit();
}
