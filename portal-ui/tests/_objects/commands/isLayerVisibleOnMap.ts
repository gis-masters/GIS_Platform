import ImageLayer from 'ol/layer/Image';
import { ImageWMS } from 'ol/source';

import { mapService } from '../../../src/app/services/map/map.service';
import { getLayers } from './layers/getLayers';

declare const window: {
  mapService: typeof mapService;
};

export async function isLayerVisibleOnMap(layerTitle: string): Promise<boolean> {
  const url = new URL(await browser.getUrl());
  const projectId = url.pathname.split('/')[2];

  if (!/^\d+$/.test(projectId)) {
    throw new Error('Не удалось получить идентификатор текущего проекта');
  }

  const layers = await getLayers(Number(projectId));
  const layer = layers.find(l => l.title === layerTitle);

  if (!layer?.complexName) {
    throw new Error(`Не найден слой "${layerTitle}"`);
  }

  return await browser.execute((layerComplexName: string) => {
    const mapLayers = window.mapService.map.getLayers().getArray();

    const mapLayer = mapLayers.find(mapLayer => {
      return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ((mapLayer as ImageLayer<ImageWMS> | undefined)?.getSource?.()?.getParams?.()?.LAYERS as string) ===
        layerComplexName
      );
    });

    return !!mapLayer?.getLayerState().visible;
  }, layer.complexName);
}
