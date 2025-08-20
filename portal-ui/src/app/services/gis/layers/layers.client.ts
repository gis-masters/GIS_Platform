import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { CrgLayer, CrgRasterLayer, NewCrgLayer, RelatedVectorLayers } from './layers.models';

@boundClass
class LayersClient extends Client {
  private static _instance: LayersClient;
  static get instance(): LayersClient {
    return this._instance || (this._instance = new this());
  }

  protected getProjectLayersUrl(projectId: number): string {
    return this.getProjectUrl(projectId) + '/layers';
  }

  private getRelatedLayersUrl(): string {
    return this.getProjectsUrl() + '/find-related-layers';
  }

  private getProjectLayerUrl(projectId: number, layerId: number): string {
    return `${this.getProjectUrl(projectId)}/layers/${layerId}`;
  }

  async getLayer(layerId: number, projectId: number): Promise<CrgLayer> {
    return http.get(this.getProjectLayerUrl(projectId, layerId));
  }

  async getLayers(projectId: number): Promise<CrgLayer[]> {
    return http.get<CrgLayer[]>(this.getProjectLayersUrl(projectId));
  }

  async getRelatedLayers(field: string, value: string): Promise<RelatedVectorLayers[]> {
    return http.get<RelatedVectorLayers[]>(this.getRelatedLayersUrl(), { params: { field, value } });
  }

  async createLayer(newLayer: NewCrgLayer | CrgRasterLayer, projectId: number): Promise<CrgLayer> {
    return await http.post<CrgLayer>(this.getProjectLayersUrl(projectId), newLayer);
  }

  async updateLayer(layerId: number, patch: Partial<CrgLayer>, projectId: number): Promise<void> {
    return http.patch(this.getProjectLayerUrl(projectId, layerId), patch);
  }

  async deleteLayer(layerId: number, projectId: number): Promise<void> {
    return http.delete(this.getProjectLayerUrl(projectId, layerId));
  }
}

export const layersClient = LayersClient.instance;
