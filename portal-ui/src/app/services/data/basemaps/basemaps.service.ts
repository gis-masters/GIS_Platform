import { communicationService } from '../../communication.service';
import { PageOptions } from '../../models';

import { Basemap } from './basemaps.models';
import {
  _reqBetBasemapsWithParticularOne,
  _reqDeleteBasemap,
  _reqGetBasemap,
  _reqGetBasemaps,
  _reqUpdateBasemap
} from './basemaps.client';

export async function getBasemap(id: number): Promise<Basemap> {
  return await _reqGetBasemap(id);
}

export async function getBasemaps(pageOptions: PageOptions): Promise<[Basemap[], number]> {
  const response = await _reqGetBasemaps(pageOptions);

  return [(response._embedded && response._embedded.basemaps) || [], response.page.totalPages];
}

export async function getBasemapsWithParticularOne(
  id: number,
  pageOptions: PageOptions
): Promise<[Basemap[], number, number] | undefined> {
  return await _reqBetBasemapsWithParticularOne(id, pageOptions);
}

export async function updateBasemap(basemap: Basemap, patch: Partial<Basemap>): Promise<void> {
  await _reqUpdateBasemap(basemap.id, patch);
  communicationService.basemapUpdated.emit({ type: 'update', data: { ...basemap, ...patch } });
}

export async function deleteBasemap(basemap: Basemap): Promise<void> {
  await _reqDeleteBasemap(basemap.id);
  communicationService.basemapUpdated.emit({ type: 'delete', data: basemap });
}
