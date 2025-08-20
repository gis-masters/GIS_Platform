import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';
import { GeoserverClient } from '../GeoserverClient';

@boundClass
class WmsClient extends GeoserverClient {
  private static _instance: WmsClient;
  static get instance(): WmsClient {
    return this._instance || (this._instance = new this());
  }

  getWmsUrl(): string {
    return this.getGeoserverUrl() + '/wms';
  }

  getMap(url: string): Promise<Blob> {
    return http.get<Blob>(url, {
      responseType: 'blob',
      cache: { maxAge: 1000 }
    });
  }

  getMapByXml(xml: string): Promise<Blob> {
    return http.post<Blob>(this.getWmsUrl(), xml, {
      headers: { 'Content-Type': Mime.XML },
      responseType: 'blob',
      params: {
        exceptions: Mime.JSON
      },
      cache: { disabled: true, clear: false }
    });
  }

  getLegendGraphic(complexLayerName: string, ruleName?: string, styleName?: string, style?: string): Promise<Blob> {
    const params: Record<string, string> = {
      REQUEST: 'GetLegendGraphic',
      VERSION: '1.3.0',
      FORMAT: 'image/png',
      WIDTH: '40',
      HEIGHT: '20',
      LAYER: complexLayerName
    };

    if (styleName) {
      params.STYLE = styleName;
    }

    if (style) {
      params.SLD_BODY = style;
    }

    if (ruleName) {
      params.RULE = ruleName;
    }

    return http.get<Blob>(this.getWmsUrl(), { responseType: 'blob', params });
  }
}

export const wmsClient = WmsClient.instance;
