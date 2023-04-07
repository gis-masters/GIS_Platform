import { CrgLayer, CrgRasterLayer, NewCrgLayer } from '../../../../src/app/services/gis/layers/layers.models';
import { _reqCreateLayer } from '../../../../src/app/services/gis/layers/layers.client';
import { requestAsAdmin } from '../requestAs';

export async function createLayerAsAdmin(projectId: number, layer: NewCrgLayer | CrgRasterLayer): Promise<CrgLayer> {
  return await requestAsAdmin(_reqCreateLayer, layer, projectId);
}
