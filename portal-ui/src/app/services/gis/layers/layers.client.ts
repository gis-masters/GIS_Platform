import { http } from '../../api/http.service';
import { CrgLayer, CrgRasterLayer, NewCrgLayer } from './layers.models';
import { getProjectLayersUrl, getProjectLayerUrl } from '../../api/server-urls.service';

export async function _reqDeleteLayer(layerId: number, projectId: number): Promise<void> {
  return http.delete(await getProjectLayerUrl(projectId, layerId));
}

export async function _reqCreateLayer(newLayer: NewCrgLayer | CrgRasterLayer, projectId: number): Promise<CrgLayer> {
  return await http.post<CrgLayer>(await getProjectLayersUrl(projectId), newLayer);
}

export async function _reqUpdateLayer(layerId: number, patch: Partial<CrgLayer>, projectId: number): Promise<void> {
  return http.patch(await getProjectLayerUrl(projectId, layerId), patch);
}
