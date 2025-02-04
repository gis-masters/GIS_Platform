import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { PageOptions } from '../../models';
import { Basemap } from './basemaps.models';

@boundClass
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

  async getBasemaps(pageOptions: PageOptions): Promise<PageableResources<Basemap>> {
    const params = preparePageOptions(pageOptions);

    return await http.get<PageableResources<Basemap>>(this.getBasemapsUrl(), { params });
  }

  async getBasemapsByIds(ids: number[]): Promise<Basemap[]> {
    const params = { ids: ids.join(', ') };

    return await http.getPaged<Basemap>(this.getBasemapsByIdsUrl(), { params });
  }

  async betBasemapsWithParticularOne(
    id: number,
    pageOptions: PageOptions
  ): Promise<[Basemap[], number, number] | undefined> {
    return await http.getPageWithObject<Basemap>(
      this.getBasemapsUrl(),
      preparePageOptions(pageOptions),
      (item: Basemap) => item.id === id,
      {}
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
