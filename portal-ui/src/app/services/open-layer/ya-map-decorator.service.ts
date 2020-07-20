import { Extent } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import { openLayersService } from './open-layers.service';

class YaMapDecorator {
  private static _instance: YaMapDecorator;

  constructor() {
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public fitToBbox(extent: Extent, padding: [number, number, number, number]) {
    const lonLat1 = fromLonLat([extent[0], extent[1]]);
    const lonLat2 = fromLonLat([extent[2], extent[3]]);

    openLayersService.fitToBbox([lonLat1[0], lonLat1[1], lonLat2[0], lonLat2[1]], padding);
  }
}

export const yaMapDecorator = YaMapDecorator.instance;
