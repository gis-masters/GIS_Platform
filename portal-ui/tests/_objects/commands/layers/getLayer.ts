import { layersClient } from '../../../../src/app/services/gis/layers/layers.client';
import { CrgLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { requestAsAdmin } from '../requestAs';

export async function getLayer(layerId: number, projectId: number): Promise<CrgLayer> {
  return await requestAsAdmin(layersClient.getLayer, layerId, projectId);
}
