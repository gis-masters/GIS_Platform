import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { CrgLayer } from '../../gis/layers/layers.models';
import { GeoserverClient } from '../GeoserverClient';
import { FeatureType, FeatureTypeHref } from './featureType.model';
import { extractFeatureTypeNameFromComplexName, extractWorkspaceFromComplexName } from './featureType.util';

@boundClass
class FeatureTypeClient extends GeoserverClient {
  private static _instance: FeatureTypeClient;
  static get instance(): FeatureTypeClient {
    return this._instance || (this._instance = new this());
  }

  getFeatureTypesUrl(workspace: string, datastore: string): string {
    return `${this.getGeoserverWorkspaceUrl(workspace)}/datastores/${datastore}/featuretypes`;
  }

  getFeatureTypesInfoUrl(workspace: string, datastore: string): string {
    return `${this.getFeatureTypesUrl(workspace, datastore)}.json`;
  }

  getFeatureTypeUrl(workspace: string, datastore: string, feature: string): string {
    return `${this.getFeatureTypesUrl(workspace, datastore)}/${feature}`;
  }

  getFeatureTypeInfoUrl(workspace: string, datastore: string, feature: string): string {
    return `${this.getFeatureTypeUrl(workspace, datastore, feature)}.json`;
  }

  async getFeatureType(layer: CrgLayer): Promise<FeatureType> {
    const result = await http.get<{ featureType: FeatureType }>(this.buildFeatureTypeUrl(layer));

    return result.featureType;
  }

  async getFeatureTypes(workspace: string, datastore: string) {
    return http.get<{ featureTypes: { featureType: FeatureTypeHref[] } }>(
      this.getFeatureTypesInfoUrl(workspace, datastore),
      {
        cache: { disabled: true }
      }
    );
  }

  async recalculateBbox(layer: CrgLayer) {
    return http.put(
      this.buildFeatureTypeUrl(layer),
      { featureType: {} },
      { params: { recalculate: 'nativebbox,latlonbbox' } }
    );
  }

  /**
   * Удаляет featureType со всеми слоями, основанными от этого featureType.
   */
  async deleteRecursively(workspace: string, datastore: string, feature: string) {
    return http.delete(this.getFeatureTypeUrl(workspace, datastore, feature), { params: { recurse: 'true' } });
  }

  private buildFeatureTypeUrl(layer: CrgLayer): string {
    const workspace = extractWorkspaceFromComplexName(layer.complexName);
    const featureTypeName = extractFeatureTypeNameFromComplexName(layer.complexName);
    const datastore = layer.dataset;
    if (!datastore) {
      throw new Error(`У слоя: '${layer.complexName}' не указан dataset`);
    }

    return this.getFeatureTypeInfoUrl(workspace, datastore, featureTypeName);
  }
}

export const featureTypeClient = FeatureTypeClient.instance;
