import { reaction } from 'mobx';
import { Snap } from 'ol/interaction';

import { mapSnapStore } from '../../../stores/MapSnap.store';
import { mapService } from '../map.service';

class MapSnapService {
  private static _instance: MapSnapService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private currentSnap: Snap | null;

  constructor() {
    this.currentSnap = null;

    reaction(
      () => mapSnapStore.pixelTolerance,
      pixelTolerance => {
        this.changePixelTolerance(pixelTolerance);
      }
    );
  }

  activate() {
    this.changePixelTolerance(mapSnapStore.pixelTolerance);
  }

  deactivate() {
    if (this.currentSnap) {
      this.currentSnap.setActive(false);
      mapService.map.removeInteraction(this.currentSnap);
      this.currentSnap = null;
    }
  }

  private changePixelTolerance(pixelTolerance: number) {
    this.deactivate();

    this.currentSnap = new Snap({
      source: mapService.draftSource,
      pixelTolerance: pixelTolerance
    });

    mapService.map.addInteraction(this.currentSnap);
  }
}

export const mapSnapService = MapSnapService.instance;
