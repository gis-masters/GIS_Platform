import { CrgLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { layersClient } from '../../../../src/app/services/gis/layers/layers.client';
import { requestAsAdmin } from '../requestAs';

export async function updateLayer(layerId: number, patch: Partial<CrgLayer>, projectId: number): Promise<void> {
  return await requestAsAdmin(layersClient.updateLayer, layerId, patch, projectId);
}
