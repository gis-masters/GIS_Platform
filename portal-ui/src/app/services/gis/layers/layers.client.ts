import { boundClass } from 'autobind-decorator';

import { GisClient } from '../GisClient';
import { http } from '../../api/http.service';
import { CrgLayer, CrgRasterLayer, NewCrgLayer } from './layers.models';

@boundClass
class LayersClient extends GisClient {
  private static _instance: LayersClient;

  static get instance(): LayersClient {
    return this._instance || (this._instance = new this());
  }

  private getProjectLayerUrl(projectId: number, layerId: number): string {
    return `${this.getProjectUrl(projectId)}/layers/${layerId}`;
  }

  async deleteLayer(layerId: number, projectId: number): Promise<void> {
    return http.delete(this.getProjectLayerUrl(projectId, layerId));
  }

  async createLayer(newLayer: NewCrgLayer | CrgRasterLayer, projectId: number): Promise<CrgLayer> {
    return await http.post<CrgLayer>(this.getProjectLayersUrl(projectId), newLayer);
  }

  async updateLayer(layerId: number, patch: Partial<CrgLayer>, projectId: number): Promise<void> {
    return http.patch(this.getProjectLayerUrl(projectId, layerId), patch);
  }
}

export const layersClient = LayersClient.instance;
