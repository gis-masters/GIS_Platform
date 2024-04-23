import { communicationService } from '../../communication.service';
import { PageOptions } from '../../models';
import { basemapsClient } from './basemaps.client';
import { Basemap } from './basemaps.models';

export async function getBasemap(id: number): Promise<Basemap> {
  return await basemapsClient.getBasemap(id);
}

export async function getBasemaps(pageOptions: PageOptions): Promise<[Basemap[], number]> {
  const response = await basemapsClient.getBasemaps(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function getBasemapsByIds(ids: number[]): Promise<Basemap[]> {
  return await basemapsClient.getBasemapsByIds(ids);
}

export async function getBasemapsWithParticularOne(
  id: number,
  pageOptions: PageOptions
): Promise<[Basemap[], number, number] | undefined> {
  return await basemapsClient.betBasemapsWithParticularOne(id, pageOptions);
}

export async function updateBasemap(basemap: Basemap, patch: Partial<Basemap>): Promise<void> {
  await basemapsClient.updateBasemap(basemap.id, patch);
  communicationService.basemapUpdated.emit({ type: 'update', data: { ...basemap, ...patch } });
}

export async function deleteBasemap(basemap: Basemap): Promise<void> {
  await basemapsClient.deleteBasemap(basemap.id);
  communicationService.basemapUpdated.emit({ type: 'delete', data: basemap });
}
