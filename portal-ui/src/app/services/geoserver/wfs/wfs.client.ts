import { boundClass } from 'autobind-decorator';

import { getWfsUrl } from '../../api/server-urls.service';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';

import { WfsFeatureCollection } from './wfs.models';
import { GeoserverClient } from '../GeoserverClient';

@boundClass
class WfsClient extends GeoserverClient {
  private static _instance: WfsClient;

  static get instance(): WfsClient {
    return this._instance || (this._instance = new this());
  }

  async getFeatureCollectionByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
    return http.post<WfsFeatureCollection>(getWfsUrl(), xml, {
      headers: { 'Content-Type': Mime.XML },
      params: {
        exceptions: Mime.JSON,
        outputFormat: Mime.JSON
      },
      cache: { clear: false, disabled: false }
    });
  }

  async getFeatureCollection(params: Record<string, string>): Promise<WfsFeatureCollection> {
    return http.get<WfsFeatureCollection>(getWfsUrl(), { params, headers: { 'Content-Type': Mime.JSON } });
  }
}

export const wfsClient = new WfsClient();
