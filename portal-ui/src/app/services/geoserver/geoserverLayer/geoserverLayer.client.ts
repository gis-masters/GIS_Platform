import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { replaceUrl } from '../../api/server-urls.service';
import { GeoserverClient } from '../GeoserverClient';

import { GeoserverCoverage, GeoserverLayerInfo } from './geoserverLayer.models';

@boundClass
class GeoserverLayerClient extends GeoserverClient {
  private static _instance: GeoserverLayerClient;

  static get instance(): GeoserverLayerClient {
    return this._instance || (this._instance = new this());
  }

  getGeoserverLayerInfo(workspace: string, tableName: string): Promise<{ layer: GeoserverLayerInfo }> {
    return http.get<{ layer: GeoserverLayerInfo }>(
      `${this.getGeoserverUrl()}/rest/workspaces/${workspace}/layers/${tableName}`
    );
  }

  getGeoserverLayerCoverage(geoserverLayerInfo: GeoserverLayerInfo): Promise<{ coverage: GeoserverCoverage }> {
    const url = replaceUrl(geoserverLayerInfo.resource.href, true);

    return http.get<{ coverage: GeoserverCoverage }>(url);
  }
}

export const geoserverLayerClient = GeoserverLayerClient.instance;
