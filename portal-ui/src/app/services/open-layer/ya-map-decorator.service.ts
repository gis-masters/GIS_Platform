import { Feature } from 'ol';
import { Extent } from 'ol/extent';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { openLayersService } from './open-layers.service';

class YaMapDecorator {
  private static _instance: YaMapDecorator;

  constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public fitToBbox(extent: Extent, padding: [number, number, number, number]) {
    const lonLat1 = fromLonLat([extent[0], extent[1]]);
    const lonLat2 = fromLonLat([extent[2], extent[3]]);

    openLayersService.fitToBbox([lonLat1[0], lonLat1[1], lonLat2[0], lonLat2[1]], padding);
  }

  drawMarker(pos: number[]) {
    const lonLat = fromLonLat(pos);

    const iconStyle = new Style({
      image: new Icon({
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: '/assets/images/map-marker.png'
      })
    });

    const iconFeature = new Feature({
      geometry: new Point(lonLat)
    });

    iconFeature.setStyle(iconStyle);

    openLayersService.drawMarkers([iconFeature]);
  }
}

export const yaMapDecorator = YaMapDecorator.instance;
