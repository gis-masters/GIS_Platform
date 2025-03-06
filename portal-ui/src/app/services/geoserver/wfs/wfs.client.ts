import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';
import { GeoserverClient } from '../GeoserverClient';
import { WfsFeatureCollection } from './wfs.models';

@boundClass
class WfsClient extends GeoserverClient {
  private static _instance: WfsClient;
  static get instance(): WfsClient {
    return this._instance || (this._instance = new this());
  }

  protected getWfsUrl(): string {
    return this.getGeoserverUrl() + '/wfs';
  }

  async getFeatureCollectionByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
    return http.post<WfsFeatureCollection>(this.getWfsUrl(), xml, {
      headers: { 'Content-Type': Mime.XML },
      params: {
        exceptions: Mime.JSON,
        outputFormat: Mime.JSON
      },
      cache: { clear: false, disabled: false }
    });
  }

  async getFeatureCollection(params: Record<string, string>): Promise<WfsFeatureCollection> {
    return http.get<WfsFeatureCollection>(this.getWfsUrl(), { params, headers: { 'Content-Type': Mime.JSON } });
  }

  update(payload: string): Promise<string> {
    return http.post(this.getWfsUrl(), payload, { headers: { 'Content-Type': Mime.XML }, responseType: 'text' });
  }
}

export const wfsClient = new WfsClient();
