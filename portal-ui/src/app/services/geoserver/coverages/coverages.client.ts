import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { CrgLayer } from '../../gis/layers/layers.models';
import {
  extractFeatureTypeNameFromComplexName,
  extractWorkspaceFromComplexName
} from '../featureType/featureType.util';
import { GeoserverClient } from '../GeoserverClient';
import { CoverageTransparentColor, GeoserverCoverage } from './coverages.model';

@boundClass
class CoveragesClient extends GeoserverClient {
  private static _instance: CoveragesClient;
  static get instance(): CoveragesClient {
    return this._instance || (this._instance = new this());
  }

  getCoverageInfoUrl(workspace: string, coverageStore: string, coverage: string): string {
    return `${this.getGeoserverWorkspaceUrl(workspace)}/coveragestores/${coverageStore}/coverages/${coverage}.json`;
  }

  async getCoverage(workspace: string, coverageStore: string, coverage: string): Promise<CoverageTransparentColor> {
    return http.get(this.getCoverageInfoUrl(workspace, coverageStore, coverage));
  }

  async getCoverageByUrl(url: string) {
    return http.get<{ coverage: GeoserverCoverage }>(url);
  }

  async update(
    workspace: string,
    coverageStore: string,
    coverages: string,
    payload: {
      coverage: { parameters: { entry: { string: string[] }[] } };
    }
  ) {
    return http.put(this.getCoverageInfoUrl(workspace, coverageStore, coverages), payload);
  }

  async recalculateBbox(layer: CrgLayer) {
    return http.put(this.buildCoverageUrl(layer), { coverage: {} }, { params: { calculate: 'nativebbox,latlonbbox' } });
  }

  private buildCoverageUrl(layer: CrgLayer): string {
    const workspace = extractWorkspaceFromComplexName(layer.complexName);
    const coverage = extractFeatureTypeNameFromComplexName(layer.complexName);
    const coverageStore = layer.dataset;

    if (!coverageStore) {
      throw new Error(`У слоя: '${layer.complexName}' не указан dataset`);
    }

    return this.getCoverageInfoUrl(workspace, coverageStore, coverage);
  }
}

export const coveragesClient = CoveragesClient.instance;
