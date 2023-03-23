import { CrgLayer } from '../../../../src/app/services/gis/projects/projects.models';
import { createLayer } from '../../../../src/app/services/gis/layers.service';

import { authenticateAsAdmin } from '../auth/authenticate';

declare const window: {
  createLayer: typeof createLayer;
};

export async function createLayerByAdmin(projectId: number, layer: CrgLayer): Promise<CrgLayer> {
  await authenticateAsAdmin();

  return await browser.executeAsync(
    async (projectId, serializedLayer, callback) => {
      const layer = JSON.parse(serializedLayer) as CrgLayer;

      const newLayer = await window.createLayer(layer, projectId);

      callback(newLayer);
    },
    projectId,
    JSON.stringify(layer)
  );
}
