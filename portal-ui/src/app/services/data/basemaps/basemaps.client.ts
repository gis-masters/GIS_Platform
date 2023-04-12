import { PageableResponse, PageOptions } from '../../models';
import { preparePageOptions } from '../../api/http.utils';
import { http } from '../../api/http.service';
import { Client } from '../../api/Client';

import { Basemap } from './basemaps.models';

class BasemapsClient extends Client {
  private static _instance: BasemapsClient;

  static get instance(): BasemapsClient {
    return this._instance || (this._instance = new this());
  }

  private getBasemapsUrl(): string {
    return this.getDataUrl() + '/basemaps';
  }

  private getBasemapUrl(basemapId: number): string {
    return `${this.getBasemapsUrl()}/${basemapId}`;
  }

  private getBasemapsByIdsUrl(): string {
    return this.getBasemapsUrl() + '/search/findByIdIn';
  }

  async getBasemap(id: number): Promise<Basemap> {
    return await http.get(this.getBasemapUrl(id));
  }

  async getBasemaps(pageOptions: PageOptions): Promise<PageableResponse<Basemap>> {
    const params = preparePageOptions(pageOptions);

    return await http.get<PageableResponse<Basemap>>(this.getBasemapsUrl(), { params });
  }

  async getBasemapsByIds(ids: number[]): Promise<Basemap[]> {
    const params = { ids: ids.join(', ') };

    return await http.getPagedOld<Basemap>(this.getBasemapsByIdsUrl(), { params });
  }

  async betBasemapsWithParticularOne(
    id: number,
    pageOptions: PageOptions
  ): Promise<[Basemap[], number, number] | undefined> {
    return await http.getPageWithObject<Basemap>(
      this.getBasemapsUrl(),
      preparePageOptions(pageOptions),
      (item: Basemap) => item.id === id,
      {},
      true
    );
  }

  async updateBasemap(id: number, patch: Partial<Basemap>): Promise<void> {
    return await http.patch(this.getBasemapUrl(id), patch);
  }

  async deleteBasemap(id: number): Promise<void> {
    await http.delete(this.getBasemapUrl(id));
  }
}

export const basemapsClient = BasemapsClient.instance;
