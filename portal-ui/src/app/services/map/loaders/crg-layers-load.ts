import type ImageWrapper from 'ol/Image';
import type Tile from 'ol/Tile';

import { mapStore } from '../../../stores/Map.store';
import { getMap } from '../../geoserver/wms/wms.service';
import { services } from '../../services';
import { Mime } from '../../util/Mime';
import { assignTileBlobUrl } from '../map.util';

export async function crgLayersLoadFunction(tile: Tile | ImageWrapper, url: string): Promise<void> {
  mapStore.enrollLoadingStart();
  let data: Blob = new Blob();

  try {
    try {
      data = await getMap(url);
    } catch (error) {
      services.logger.error(error);
    }
    assignTileBlobUrl(tile, new Blob([data], { type: Mime.VND_JPEG_PNG8 }));
  } finally {
    mapStore.enrollLoadingFinish();
  }
}
