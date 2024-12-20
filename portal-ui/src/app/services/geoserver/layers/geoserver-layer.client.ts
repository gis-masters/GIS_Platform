import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { CrgLayer } from '../../gis/layers/layers.models';
import {
  extractFeatureTypeNameFromComplexName,
  extractWorkspaceFromComplexName
} from '../featureType/featureType.util';
import { GeoserverClient } from '../GeoserverClient';
import { GeoserverLayerInfo } from './geoserver-layer.models';

@boundClass
class GeoserverLayerClient extends GeoserverClient {
  private static _instance: GeoserverLayerClient;
  static get instance(): GeoserverLayerClient {
    return this._instance || (this._instance = new this());
  }

  async getLayerInfo(layer: CrgLayer): Promise<GeoserverLayerInfo> {
    if (!layer.tableName || !layer.complexName || !layer.nativeCRS) {
      throw new Error('Передан некорректный слой: ' + JSON.stringify(layer));
    }

    const workspace = extractWorkspaceFromComplexName(layer.complexName);
    const tableName = extractFeatureTypeNameFromComplexName(layer.complexName);

    const result = await http.get<{ layer: GeoserverLayerInfo }>(
      `${this.getGeoserverUrl()}/rest/workspaces/${workspace}/layers/${tableName}`
    );

    return result.layer;
  }
}

export const geoserverLayerClient = GeoserverLayerClient.instance;
