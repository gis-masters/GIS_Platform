import { layersClient } from '../../../../src/app/services/gis/layers/layers.client';
import {
  type CrgLayer,
  type CrgRasterLayer,
  type NewCrgLayer
} from '../../../../src/app/services/gis/layers/layers.models';
import { requestAsAdmin } from '../requestAs';

export async function createLayer(projectId: number, layer: NewCrgLayer | CrgRasterLayer): Promise<CrgLayer> {
  return await requestAsAdmin(layersClient.createLayer, layer, projectId);
}
